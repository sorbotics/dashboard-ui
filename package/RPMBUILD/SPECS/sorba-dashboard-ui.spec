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

case "$1" in
	configure)
	[ -z "$GRAFANA_USER" ] && GRAFANA_USER="grafana"
	[ -z "$GRAFANA_GROUP" ] && GRAFANA_GROUP="grafana"
	if ! getent group "$GRAFANA_GROUP" > /dev/null 2>&1 ; then
    addgroup --system "$GRAFANA_GROUP" --quiet
	fi
	if ! id $GRAFANA_USER > /dev/null 2>&1 ; then
    adduser --system --home /usr/share/grafana --no-create-home \
		--ingroup "$GRAFANA_GROUP" --disabled-password --shell /bin/false \
		"$GRAFANA_USER"
	fi

	# Set user permissions on /var/log/grafana, /var/lib/grafana
	mkdir -p /var/log/grafana /var/lib/grafana
	chown -R $GRAFANA_USER:$GRAFANA_GROUP /var/log/grafana /var/lib/grafana
	chmod 755 /var/log/grafana /var/lib/grafana

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

  # if [ ! -d $PROVISIONING_CFG_DIR ]; then
  #   mkdir -p $PROVISIONING_CFG_DIR/dashboards $PROVISIONING_CFG_DIR/datasources
  #   cp /usr/share/grafana/conf/provisioning/dashboards/sample.yaml $PROVISIONING_CFG_DIR/dashboards/sample.yaml
  #   cp /usr/share/grafana/conf/provisioning/datasources/sample.yaml $PROVISIONING_CFG_DIR/datasources/sample.yaml
  # fi

  # if [ ! -d $PROVISIONING_CFG_DIR/notifiers ]; then
  #   mkdir -p $PROVISIONING_CFG_DIR/notifiers
  #   cp /usr/share/grafana/conf/provisioning/notifiers/sample.yaml $PROVISIONING_CFG_DIR/notifiers/sample.yaml
  # fi

  # if [ ! -d $PROVISIONING_CFG_DIR/plugins ]; then
  #   mkdir -p $PROVISIONING_CFG_DIR/plugins
  #   cp /usr/share/grafana/conf/provisioning/plugins/sample.yaml $PROVISIONING_CFG_DIR/plugins/sample.yaml
  # fi

  # if [ ! -d $PROVISIONING_CFG_DIR/access-control ]; then
  #   mkdir -p $PROVISIONING_CFG_DIR/access-control
  #   cp /usr/share/grafana/conf/provisioning/access-control/sample.yaml $PROVISIONING_CFG_DIR/access-control/sample.yaml
  # fi

  if [ -f "$PROVISIONING_CFG_DIR/datasources/influxdb.yaml" ]; then
    rm -f "$PROVISIONING_CFG_DIR/datasources/influxdb.yaml"
  fi

  if [ -f "$PROVISIONING_CFG_DIR/datasources/sorbaml.yaml" ]; then
    rm -f "$PROVISIONING_CFG_DIR/datasources/sorbaml.yaml"
  fi

  if [ -f "$PROVISIONING_CFG_DIR/datasources/sorbamlmysql.yaml" ]; then
    rm -f "$PROVISIONING_CFG_DIR/datasources/sorbamlmysql.yaml"
  fi

	# configuration files should not be modifiable by grafana user, as this can be a security issue
	chown -Rh root:$GRAFANA_GROUP /etc/grafana/*
	chmod 755 /etc/grafana
	find /etc/grafana -type f -exec chmod 640 {} ';'
	find /etc/grafana -type d -exec chmod 755 {} ';'

  # If $1=configure and $2 is set, this is an upgrade
  if [ "$2" != "" ]; then
    IS_UPGRADE=true
  fi

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
    # sed -i "s/;app_mode = production/app_mode = development/g" $CONF_FILE || true
    sed -i "s/app_mode = production/app_mode = development/g" $CONF_FILE || true
    cat $CONF_FILE | grep development
  fi

  if command -v systemctl >/dev/null; then
    systemctl stop grafana-server >> /dev/null 2>&1 || true
    systemctl disable grafana-server >> /dev/null 2>&1 || true
    rm /usr/lib/systemd/system/grafana-server.service >> /dev/null 2>&1 || true
    rm /etc/init.d/grafana-server >> /dev/null 2>&1 || true
  fi

  if [ "$DISABLED" = "true" ]; then
    echo "Service disabled";
    exit 0;
  fi

  # if [ "x$IS_UPGRADE" != "xtrue" ]; then
  #   if command -v systemctl >/dev/null; then
  #     echo "### NOT starting on installation, please execute the following statements to configure grafana to start automatically using systemd"
  #     echo " sudo /bin/systemctl daemon-reload"
  #     echo " sudo /bin/systemctl enable grafana-server"
  #     echo "### You can start grafana-server by executing"
  #     echo " sudo /bin/systemctl start grafana-server"
  #   elif command -v update-rc.d >/dev/null; then
  #     echo "### NOT starting grafana-server by default on bootup, please execute"
  #     echo " sudo update-rc.d grafana-server defaults 95 10"
  #     echo "### In order to start grafana-server, execute"
  #     echo " sudo service grafana-server start"
  #   fi
  # elif [ "$RESTART_ON_UPGRADE" = "true" ]; then
  #   echo -n "Restarting grafana-server service..."
  #   if command -v systemctl >/dev/null; then
  #     systemctl daemon-reload
  #     systemctl restart grafana-server || true
  #   elif [ -x /etc/init.d/grafana-server ]; then
  #     if command -v invoke-rc.d >/dev/null; then
  #       invoke-rc.d grafana-server restart || true
  #     else
  #       /etc/init.d/grafana-server restart || true
  #     fi
  #   fi
  #   echo " OK"
	# fi

  if (service supervisor status | grep "not running" > /dev/null) || (service supervisor status | grep "inactive" > /dev/null); then
    service supervisor start
  fi

  if [ "$PREV_CONF" != "$SUPERVISOR_CONF_CONTENT" ]; then # Configuration file changes and needs to be reloaded
    echo "Rereading supervisor conf files"
    supervisorctl reread || echo "Warning: Supervisor could not be reread"
    supervisorctl update || echo "Warning: Supervisor could not be updated"
  fi
  
  echo "Restarting $PROGRAM service"
  supervisorctl restart $PROGRAM || echo "Warning: $PROGRAM couldn't be restarted"

  service nginx reload || true
	;;
esac

%files
/etc/nginx/apps.d/pkg_dashboard.conf
/etc/grafana/provisioning/*
/usr/sbin/grafana-cli
/usr/sbin/grafana-server
/usr/sbin/start-grafana
/usr/share/grafana/*
/usr/share/doc/grafana/*
/usr/share/doc/sorba-dashboard-ui/*
/var/lib/grafana/plugins/*
%defattr(-,root,root,-)
%config(noreplace) /var/lib/grafana/plugins/*