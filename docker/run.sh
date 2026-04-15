#!/bin/bash -e

PERMISSIONS_OK=0

if [ ! -r "$GF_PATHS_CONFIG" ]; then
  echo "GF_PATHS_CONFIG='$GF_PATHS_CONFIG' is not readable."
  PERMISSIONS_OK=1
fi

if [ ! -w "$GF_PATHS_DATA" ]; then
  echo "GF_PATHS_DATA='$GF_PATHS_DATA' is not writable."
  PERMISSIONS_OK=1
fi

if [ ! -r "$GF_PATHS_HOME" ]; then
  echo "GF_PATHS_HOME='$GF_PATHS_HOME' is not readable."
  PERMISSIONS_OK=1
fi

if [ $PERMISSIONS_OK -eq 1 ]; then
  echo "You may have issues with file permissions, more information here: http://docs.grafana.org/installation/docker/#migrate-to-v51-or-later"
fi

if [ ! -d "$GF_PATHS_PLUGINS" ]; then
  mkdir "$GF_PATHS_PLUGINS"
fi

# Convert all environment variables with names ending in __FILE into the content of
# the file that they point at and use the name without the trailing __FILE.
# This can be used to carry in Docker secrets.
for VAR_NAME in $(env | grep '^GF_[^=]\+__FILE=.\+' | sed -r "s/([^=]*)__FILE=.*/\1/g"); do
  VAR_NAME_FILE="$VAR_NAME"__FILE
  if [ "${!VAR_NAME}" ]; then
    echo >&2 "ERROR: Both $VAR_NAME and $VAR_NAME_FILE are set (but are exclusive)"
    exit 1
  fi
  echo "Getting secret $VAR_NAME from ${!VAR_NAME_FILE}"
  export "$VAR_NAME"="$(< "${!VAR_NAME_FILE}")"
  unset "$VAR_NAME_FILE"
done

export HOME="$GF_PATHS_HOME"

if [ ! -z "${GF_INSTALL_PLUGINS}" ]; then
  OLDIFS=$IFS
  IFS=','
  for plugin in ${GF_INSTALL_PLUGINS}; do
    IFS=$OLDIFS
    if [[ $plugin =~ .*\;.* ]]; then
      pluginUrl=$(echo "$plugin" | cut -d';' -f 1)
      pluginInstallFolder=$(echo "$plugin" | cut -d';' -f 2)
      grafana-cli --pluginUrl ${pluginUrl} --pluginsDir "${GF_PATHS_PLUGINS}" plugins install "${pluginInstallFolder}"
    else
      grafana-cli --pluginsDir "${GF_PATHS_PLUGINS}" plugins install ${plugin}
    fi
  done
fi

if [[ -n "$REDIS_HOST" && -n "$REDIS_PORT" ]]; then
  REDIS_DB=${REDIS_DB:-0}

  until redis-cli -h $REDIS_HOST -p $REDIS_PORT PING | grep -q PONG; do
    echo "Waiting for redis to write version..."
    sleep 1
  done

  redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -n "$REDIS_DB" SET "app:${PACKAGE_NAME}:version" "${PACKAGE_VERSION}"

  echo "PACKAGE: ${PACKAGE_NAME}"
  echo "VERSION: ${PACKAGE_VERSION}"
fi

exec grafana-server                                           \
  --homepath="$GF_PATHS_HOME"                                 \
  --config="$GF_PATHS_CONFIG"                                 \
  --packaging=docker                                          \
  "$@"                                                        \
  cfg:log.mode="console"                                      \
  cfg:paths.data="$GF_PATHS_DATA"                             \
  cfg:paths.logs="$GF_PATHS_LOGS"                             \
  cfg:paths.plugins="$GF_PATHS_PLUGINS"                       \
  cfg:paths.provisioning="$GF_PATHS_PROVISIONING"             \
  cfg:security.admin_user="$GF_SECURITY_ADMIN_USER"           \
  cfg:security.admin_password="$GF_SECURITY_ADMIN_PASSWORD"   \
  cfg:security.allow_embedding="$GF_SECURITY_ALLOW_EMBEDDING" \
  cfg:auth.anonymous.enabled="$GF_AUTH_ANONYMOUS_ENABLED"     \
  cfg:database.type="mysql"                                   \
  cfg:database.host="${MYSQL_HOST}:${MYSQL_PORT}"             \
  cfg:database.name="dashboard"                               \
  cfg:database.password="${MYSQL_PASSWORD}"                   

# cfg:remote_cache.type="redis"
# cfg:remote_cache.connstr="addr=${REDIS_HOST}:${REDIS_PORT},pool_size=${REDIS_POOL_SIZE},db=${REDIS_DB},ssl=${REDIS_USE_SSL},abortConnect=false"
