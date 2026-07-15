#!/bin/sh

GRAFANA_VERSION="13.0.2"
GRAFANA_SRC="${GRAFANA_VERSION}/grafana-${GRAFANA_VERSION}"

SOURCE_DEB_DIR="$HOME/dashboard"
SOURCE_PLUGINS_DIR="$HOME/plugins"

if [ -z "$CI_PROJECT_DIR" ]; then
  CI_PROJECT_DIR=$(pwd)
fi

GRAFANA_HOME="${SOURCE_DEB_DIR}/usr/share/grafana"

if [ -d "$SOURCE_DEB_DIR" ]; then
  rm -rf "$SOURCE_DEB_DIR"
fi
mkdir -p "$GRAFANA_HOME"

echo "=== Building Sorba Dashboard UI $GRAFANA_VERSION ==="

# 1. DEBIAN control files
echo "[1/7] Copying DEBIAN control files..."
cp -r "${CI_PROJECT_DIR}/package/DEBIAN" "${SOURCE_DEB_DIR}/"

# 2. Static files (etc, usr/sbin, var/lib/grafana/plugins)
echo "[2/7] Copying static files..."
cp -r "${CI_PROJECT_DIR}/package/files/." "${SOURCE_DEB_DIR}/"

# 3. Grafana binaries only
echo "[3/7] Copying binaries..."
mkdir -p "${GRAFANA_HOME}/bin"
cp "${CI_PROJECT_DIR}/${GRAFANA_SRC}/bin/grafana" "${GRAFANA_HOME}/bin/grafana"
cp "${CI_PROJECT_DIR}/${GRAFANA_SRC}/bin/grafana-cli" "${GRAFANA_HOME}/bin/grafana-cli" 2>/dev/null || true

# 4. Compiled frontend (public/build + public/img + public/fonts + public/views + public/locales)
echo "[4/7] Copying frontend assets..."
mkdir -p "${GRAFANA_HOME}/public"
cp -r "${CI_PROJECT_DIR}/${GRAFANA_SRC}/public/build" "${GRAFANA_HOME}/public/"
cp -r "${CI_PROJECT_DIR}/${GRAFANA_SRC}/public/img" "${GRAFANA_HOME}/public/"
cp -r "${CI_PROJECT_DIR}/${GRAFANA_SRC}/public/fonts" "${GRAFANA_HOME}/public/"
cp -r "${CI_PROJECT_DIR}/${GRAFANA_SRC}/public/views" "${GRAFANA_HOME}/public/"
cp -r "${CI_PROJECT_DIR}/${GRAFANA_SRC}/public/locales" "${GRAFANA_HOME}/public/"
cp -r "${CI_PROJECT_DIR}/${GRAFANA_SRC}/public/emails" "${GRAFANA_HOME}/public/" 2>/dev/null || true
cp -r "${CI_PROJECT_DIR}/${GRAFANA_SRC}/public/dashboards" "${GRAFANA_HOME}/public/" 2>/dev/null || true

# 4b. Built-in plugin metadata for panel and core datasource types (required for
#     the server-side plugin store to register text/influxdb/etc. in
#     /api/frontend/settings).
#     - Skips duplicate */dist/plugin.json build copies.
#     - Skips workspace plugins (mysql, postgres, cloudwatch, loki, etc.) which
#       have a separate frontend module in dist/ and a Go backend (gpx_*)
#       that aren't bundled here. They must be installed via the UI or
#       `grafana-cli plugins install <id>`, otherwise the in-tree plugin.json
#       would shadow the working installed plugin and produce a broken
#       config editor (no module.js → "Could not load plugin").
WORKSPACE_PLUGINS="azuremonitor cloud-monitoring cloudwatch grafana-postgresql-datasource grafana-pyroscope-datasource grafana-testdata-datasource jaeger loki mssql parca tempo zipkin"
echo "[4b/7] Copying built-in plugin metadata..."
find "${CI_PROJECT_DIR}/${GRAFANA_SRC}/public/app/plugins" -name plugin.json -not -path "*/dist/*" | while IFS= read -r plugin_json; do
  rel_path="${plugin_json#${CI_PROJECT_DIR}/${GRAFANA_SRC}/public/app/plugins/}"
  case "$rel_path" in
    */dist/plugin.json) continue ;;
  esac
  plugin_name="$(basename "$(dirname "$rel_path")")"
  case " $WORKSPACE_PLUGINS " in
    *" $plugin_name "*) continue ;;
  esac
  dest_dir="${GRAFANA_HOME}/public/app/plugins/$(dirname "$rel_path")"
  mkdir -p "$dest_dir"
  cp "$plugin_json" "$dest_dir/"
done

# 4c. Built-in plugin logos (img/) copied to public/plugins/<name>/img/ — the path
#     the BaseURL exposed in /api/frontend/settings points to. Skips workspace
#     plugins (their icons come from the installed plugin, not the in-tree copy).
echo "[4c/7] Copying built-in plugin logos..."
for plugin_dir in "${CI_PROJECT_DIR}/${GRAFANA_SRC}/public/app/plugins/datasource"/*/ \
                  "${CI_PROJECT_DIR}/${GRAFANA_SRC}/public/app/plugins/panel"/*/; do
  name=$(basename "$plugin_dir")
  case " $WORKSPACE_PLUGINS " in
    *" $name "*) continue ;;
  esac
  if [ -d "${plugin_dir}img" ]; then
    mkdir -p "${GRAFANA_HOME}/public/plugins/${name}/img"
    cp -r "${plugin_dir}img/." "${GRAFANA_HOME}/public/plugins/${name}/img/"
  fi
done

# 5. Configuration files
echo "[5/7] Copying configuration..."
mkdir -p "${GRAFANA_HOME}/conf"
cp "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/defaults.ini" "${GRAFANA_HOME}/conf/"
cp "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/sample.ini" "${GRAFANA_HOME}/conf/"
cp "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/ldap.toml" "${GRAFANA_HOME}/conf/" 2>/dev/null || true
cp "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/ldap_multiple.toml" "${GRAFANA_HOME}/conf/" 2>/dev/null || true
cp -r "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/provisioning" "${GRAFANA_HOME}/conf/"

# Copy custom.ini and influx_data provisioning from 8.4.3 config
cp "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/custom.ini" "${GRAFANA_HOME}/conf/" 2>/dev/null || true
mkdir -p "${GRAFANA_HOME}/conf/provisioning/datasources"
cp "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/provisioning/datasources/influx_data.yaml" "${GRAFANA_HOME}/conf/provisioning/datasources/" 2>/dev/null || true

# 6. Plugins
echo "[6/7] Copying plugins..."
cp -r "${CI_PROJECT_DIR}/plugins/." "${SOURCE_PLUGINS_DIR}/"
# Tell build-plugins.sh where to drop built plugin dists (the staging dir).
# Without this, the env var is empty and plugins end up under /var/lib/grafana/plugins/
# (system path) instead of $SOURCE_DEB_DIR/var/lib/grafana/plugins/ (staging path).
SOURCE_GRAFANA_DIR="$SOURCE_DEB_DIR"
export SOURCE_GRAFANA_DIR
# build-plugins.sh iterates plugins/*/ relative to its cwd, so cd there first
if [ -f "${SOURCE_PLUGINS_DIR}/build-plugins.sh" ]; then
  chmod +x $SOURCE_PLUGINS_DIR/build-plugins.sh
  ( cd "$SOURCE_PLUGINS_DIR" && ./build-plugins.sh )
fi

# 7. Version and permissions
echo "[7/7] Setting version and permissions..."
if [ -f "${CI_PROJECT_DIR}/version_13.txt" ]; then
  VERSION=$(cat "${CI_PROJECT_DIR}/version_13.txt")
else
  VERSION="${GRAFANA_VERSION}-1"
fi

echo "Package version: $VERSION"
echo "$VERSION" > "${GRAFANA_HOME}/VERSION"
sed -i "s/^Version:.*/Version: ${VERSION}/" "${SOURCE_DEB_DIR}/DEBIAN/control"

chmod -R 755 "$SOURCE_DEB_DIR"

# Build .deb
echo "Building .deb package..."
cd "$HOME" && dpkg-deb -b dashboard dashboard.deb 2>&1
dpkg-name ~/dashboard.deb

# Move to project directory
mv ~/sorba-dashboard-ui_*.deb "$CI_PROJECT_DIR/" 2>/dev/null || true

# Report size
DEB_FILE=$(ls -lh "$CI_PROJECT_DIR"/sorba-dashboard-ui_${VERSION}_amd64.deb 2>/dev/null)
echo "=== Build complete ==="
echo "$DEB_FILE"
