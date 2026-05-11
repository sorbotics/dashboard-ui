%if 0%{?_version:1}
%define version %{_version}
%else
%define version 8.4.3
%endif
%{!?release: %define release 1}
Name: sorba-dashboard-ui
Version: %{version}
Release: %{release}%{?dist}
Summary: SORBA Dashboard UI based on Grafana

License: AGPLv3
URL: https://github.com/sorbotics/dashboard-ui
Source0: files.tar.gz

%description
SORBA Dashboard. Customized grafana package.

%prep
rm -rf /etc/grafana/provisioning/

%install
rm -rf $RPM_BUILD_ROOT
mkdir -p $RPM_BUILD_ROOT
tar xzf %{SOURCE0} -C %{buildroot}/
# Quitar permisos de ejecucion de archivos sin shebang(#!/bin/bash)
# find %{buildroot} -type f -exec grep -Il '^#!' {} + -exec chmod -x {} +

%post
IS_UPGRADE=false

SUPERVISOR_CONF_FILE="/etc/supervisor/conf.d/dashboard-ui.conf"

PROGRAM="dashboard-ui"
PREV_CONF=""
DISABLED=""

GRAFANA_USER=grafana

GRAFANA_GROUP=grafana

GRAFANA_HOME=/usr/share/grafana

LOG_DIR=/var/log/grafana

DATA_DIR=/var/lib/grafana

MAX_OPEN_FILES=10000

CONF_DIR=/etc/grafana

CONF_FILE=/etc/grafana/grafana.ini

RESTART_ON_UPGRADE=true

PLUGINS_DIR=/var/lib/grafana/plugins

PROVISIONING_CFG_DIR=/etc/grafana/provisioning

# Only used on systemd systems
PID_FILE_DIR=/run/grafana

SUPERVISOR_CONF_CONTENT="[program:$PROGRAM]
environment = 
command = /usr/sbin/start-grafana
stdout_logfile_maxbytes=10MB
stdout_events_enabled=true
stderr_events_enabled=true
autorestart=true
startretries=100
startsecs=10
;redirect_stdout=true
redirect_stderr=true
stdout_logfile=/opt/log/dashboard-ui.log
;stderr_logfile=/opt/log/dashboard-ui.err.log
stderr_logfile_maxbytes=10MB"

write_file () {
cat <<EOM >$1
$2
EOM
}

if ! getent group "$GRAFANA_GROUP" > /dev/null 2>&1 ; then
  groupadd -r "$GRAFANA_GROUP" 2>/dev/null || true
fi
if ! id $GRAFANA_USER > /dev/null 2>&1 ; then
  useradd -r -d /usr/share/grafana -s /bin/false -g "$GRAFANA_GROUP" "$GRAFANA_USER" 2>/dev/null || true
fi

# Set user permissions on /var/log/grafana, /var/lib/grafana
mkdir -p /var/log/grafana /var/lib/grafana
chown -R $GRAFANA_USER:$GRAFANA_GROUP /var/log/grafana /var/lib/grafana
chmod 755 /var/log/grafana /var/lib/grafana
chmod +x /usr/sbin/grafana-server

# copy user config files
if [ ! -f $CONF_FILE ]; then
  mkdir -p $CONF_DIR
  if [ -f /usr/share/grafana/conf/grafana.ini ]; then
    cp /usr/share/grafana/conf/grafana.ini $CONF_FILE
  elif [ -f /usr/share/grafana/conf/defaults.ini ]; then
    cp /usr/share/grafana/conf/defaults.ini $CONF_FILE
  elif [ -f /usr/share/grafana/conf/sample.ini ]; then
    cp /usr/share/grafana/conf/sample.ini $CONF_FILE
  fi
  # cp /usr/share/grafana/conf/ldap.toml /etc/grafana/ldap.toml
fi

# configuration files should not be modifiable by grafana user, as this can be a security issue
chown -Rh root:$GRAFANA_GROUP /etc/grafana/*
chmod 755 /etc/grafana
find /etc/grafana -type f -exec chmod 640 {} ';'
find /etc/grafana -type d -exec chmod 755 {} ';'

if [ -f "${SUPERVISOR_CONF_FILE}.disabled" ]; then
  if [ -f "$SUPERVISOR_CONF_FILE" ]; then
    rm -f "${SUPERVISOR_CONF_FILE}.disabled"
  else
    SUPERVISOR_CONF_FILE="${SUPERVISOR_CONF_FILE}.disabled"
    DISABLED="true"
  fi
fi

if [ -f "$SUPERVISOR_CONF_FILE" ]; then
  PREV_CONF=$(cat $SUPERVISOR_CONF_FILE)
fi

write_file "$SUPERVISOR_CONF_FILE" "$SUPERVISOR_CONF_CONTENT"

# chmod +x /usr/sbin/{grafana-cli,grafana-server}
chmod +x /usr/sbin/start-grafana

if [ -d /usr/share/sorba-vision-ui ]; then
  echo "SORBA Vision was found! Changing app to development environment";
  sed -i "s/app_mode = production/app_mode = development/g" $CONF_FILE || true
  cat $CONF_FILE | grep development
fi

if [ "$DISABLED" = "true" ]; then
  echo "Service disabled";
  exit 0;
fi

if (service supervisord status | grep "not running" > /dev/null) || (service supervisord status | grep "inactive" > /dev/null); then
  service supervisord start
fi

if [ "$PREV_CONF" != "$SUPERVISOR_CONF_CONTENT" ]; then # Configuration file changes and needs to be reloaded
  echo "Rereading supervisor conf files"
  supervisorctl reread || echo "Warning: Supervisor could not be reread"
  supervisorctl update || echo "Warning: Supervisor could not be updated"
fi

echo "Restarting $PROGRAM service"
supervisorctl restart $PROGRAM || echo "Warning: $PROGRAM couldn't be restarted"

service nginx reload || true

%files
/etc/nginx/apps.d/pkg_dashboard.conf
/etc/grafana/provisioning/*
/usr/sbin/grafana-cli
/usr/sbin/grafana-server
/usr/sbin/start-grafana
/usr/share/grafana/*
/usr/share/doc/grafana/*
%defattr(-,root,root,-)
%config(noreplace) /var/lib/grafana/plugins/*