#!/bin/sh

GRAFANA_VERSION="8.4.3"

SOURCE_RPM_DIR="$HOME/rpmbuild"

if [ -z "$CI_PROJECT_DIR" ]; then
  CI_PROJECT_DIR=$(pwd)
fi

if [ ! -d "$SOURCE_RPM_DIR" ]; then
  mkdir -p "$SOURCE_RPM_DIR"
fi

cp -r "$CI_PROJECT_DIR/package/RPMBUILD/." "$SOURCE_RPM_DIR/"
cp -r "${CI_PROJECT_DIR}/${GRAFANA_VERSION}/." "${CI_PROJECT_DIR}/package/files/usr/share/grafana/"

if [ -f "${CI_PROJECT_DIR}/version.txt" ]; then
  FULL_VERSION=$(cat "${CI_PROJECT_DIR}/version.txt")
fi

VERSION=$(echo "$FULL_VERSION" | cut -d'-' -f1)
RELEASE=$(echo "$FULL_VERSION" | cut -d'-' -f2)

chmod -R 755 "$SOURCE_RPM_DIR"
echo "$FULL_VERSION" > "$CI_PROJECT_DIR/package/files/usr/share/grafana/VERSION"

tar -czf "${SOURCE_RPM_DIR}/SOURCES/files.tar.gz" -C "$CI_PROJECT_DIR/package/files" .

rpmbuild -bb --define "_version $VERSION" --define "release $RELEASE" "$SOURCE_RPM_DIR/SPECS/sorba-dashboard-ui.spec" || echo "ERROR building RPM package"

mv $SOURCE_RPM_DIR/RPMS/x86_64/*.rpm . && rm -rf $SOURCE_RPM_DIR
