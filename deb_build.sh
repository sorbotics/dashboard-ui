#!/bin/sh

GRAFANA_VERSION="8.4.3"

SOURCE_DEB_DIR="$HOME/dashboard"

SOURCE_PLUGINS_DIR="$HOME/plugins"

if [ -z "$CI_PROJECT_DIR" ]; then
  CI_PROJECT_DIR=$(pwd)
fi

if [ ! -d "$SOURCE_DEB_DIR" ]; then
  mkdir -p "$SOURCE_DEB_DIR"
fi

cp -r "${CI_PROJECT_DIR}/package/DEBIAN" "${SOURCE_DEB_DIR}/"
cp -r "${CI_PROJECT_DIR}/package/files/." "${SOURCE_DEB_DIR}/"
cp -r "${CI_PROJECT_DIR}/${GRAFANA_VERSION}/." "${SOURCE_DEB_DIR}/usr/share/grafana/"

cp -r "${CI_PROJECT_DIR}/plugins/." "${SOURCE_PLUGINS_DIR}/"
chmod +x $SOURCE_PLUGINS_DIR/build-plugins.sh && $SOURCE_PLUGINS_DIR/build-plugins.sh

if [ -f "${CI_PROJECT_DIR}/version.txt" ]; then
  VERSION=$(cat "${CI_PROJECT_DIR}/version.txt")
fi

chmod -R 755 $SOURCE_DEB_DIR
echo "$VERSION" > ${SOURCE_DEB_DIR}/usr/share/grafana/VERSION

sed -i "s/^Version:.*/Version: ${VERSION}/" ${SOURCE_DEB_DIR}/DEBIAN/control

cd "$HOME" && dpkg-deb -b dashboard && dpkg-name *.deb

mv $HOME/*.deb $CI_PROJECT_DIR/
