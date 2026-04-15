ARG GRAFANA_VERSION="8.4.3"

FROM grafana/grafana:${GRAFANA_VERSION}

USER root

ARG GF_GID="0" \
  NAME="sorba-dashboard-ui" \
  VERSION="8.4.3-9"

ENV GF_PATHS_PLUGINS="/var/lib/grafana/plugins" \
  GF_APP_MODE="production" \
  GF_PATHS_CONFIG="/etc/grafana/grafana.ini" \
  GF_PATHS_DATA="/var/lib/grafana" \
  GF_PATHS_HOME="/usr/share/grafana" \
  GF_PATHS_LOGS="/var/log/grafana" \
  GF_PATHS_PROVISIONING="/etc/grafana/provisioning" \
  ENVIRONMENT_SCOPE="cloud" \
  MYSQL_HOST="mysql" \
  MYSQL_PORT="3306" \
  MYSQL_USERNAME="root" \
  MYSQL_PASSWORD="secret" \
  REDIS_HOST="redis" \
  REDIS_PORT="6379" \
  REDIS_DB="0" \
  REDIS_POOL_SIZE="100" \
  REDIS_USE_SSL="false" \
  INFLUX_HOST="influxdb" \
  INFLUX_PORT="8086" \
  INFLUX_USERNAME="admin" \
  INFLUX_PASSWORD="secret" \
  GF_SECURITY_ADMIN_USER="admin" \
  GF_SECURITY_ADMIN_PASSWORD="sbrQp10" \
  GF_SECURITY_ALLOW_EMBEDDING="true" \
  GF_AUTH_ANONYMOUS_ENABLED="true" \
  PACKAGE_NAME=$NAME \
  PACKAGE_VERSION=$VERSION

RUN mkdir -p "$GF_PATHS_PLUGINS" \
  && mkdir -p "$GF_PATHS_HOME/dashboards" \
  && chown -R grafana:${GF_GID} "$GF_PATHS_PLUGINS" \
  && chown -R grafana:${GF_GID} "$GF_PATHS_HOME/dashboards" \
  && apk add redis

COPY docker/run.sh /run.sh

RUN chmod +x /run.sh

# COPY --chown=grafana --from=development /root/plugins/ ${GF_PATHS_PLUGINS}

USER grafana

ARG GF_INSTALL_PLUGINS="ae3e-plotly-panel, isaozler-paretochart-panel, natel-discrete-panel, yesoreyeram-boomtable-panel"

RUN if [ ! -z "${GF_INSTALL_PLUGINS}" ]; then \
  OLDIFS=$IFS; \
  IFS=','; \
  for plugin in ${GF_INSTALL_PLUGINS}; do \
    IFS=$OLDIFS; \
    if expr match "$plugin" '.*\;.*'; then \
      pluginUrl=$(echo "$plugin" | cut -d';' -f 1); \
      pluginInstallFolder=$(echo "$plugin" | cut -d';' -f 2); \
      grafana-cli --pluginUrl ${pluginUrl} --pluginsDir "${GF_PATHS_PLUGINS}" plugins install "${pluginInstallFolder}"; \
    else \
      grafana-cli --pluginsDir "${GF_PATHS_PLUGINS}" plugins install ${plugin}; \
    fi \
  done \
fi

COPY 8.4.3/conf/grafana.ini ${GF_PATHS_CONFIG}
COPY 8.4.3/public/ ${GF_PATHS_HOME}/public/

COPY docker/provisioning/ ${GF_PATHS_PROVISIONING}/
# COPY docker/cloud-dashboards/ ${GF_PATHS_HOME}/dashboards/
