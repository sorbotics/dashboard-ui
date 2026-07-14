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
if [ -f "${SOURCE_PLUGINS_DIR}/build-plugins.sh" ]; then
  chmod +x $SOURCE_PLUGINS_DIR/build-plugins.sh && $SOURCE_PLUGINS_DIR/build-plugins.sh
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
