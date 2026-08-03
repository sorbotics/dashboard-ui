#!/bin/sh

set -eu

GRAFANA_VERSION="8.4.3"

if [ -z "${CI_PROJECT_DIR:-}" ]; then
  CI_PROJECT_DIR=$(pwd)
fi

TARGET_ARCH="${TARGET_ARCH:-${DEB_ARCH:-amd64}}"

case "$TARGET_ARCH" in
  x86_64)
    TARGET_ARCH="amd64"
    ;;
  aarch64)
    TARGET_ARCH="arm64"
    ;;
esac

SOURCE_DEB_DIR="$HOME/dashboard-${TARGET_ARCH}"
SOURCE_PLUGINS_DIR="$HOME/dashboard-plugins-${TARGET_ARCH}"
OUTPUT_DEB_DIR="$HOME/dashboard-output-${TARGET_ARCH}"
DOWNLOAD_DIR="$HOME/dashboard-downloads-${TARGET_ARCH}"

download_file() {
  url="$1"
  destination="$2"

  if command -v curl >/dev/null 2>&1; then
    curl -fL "$url" -o "$destination"
    return 0
  fi

  if command -v wget >/dev/null 2>&1; then
    wget -O "$destination" "$url"
    return 0
  fi

  echo "curl or wget is required to download Grafana release assets" >&2
  exit 1
}

verify_sha256() {
  expected="$1"
  file_path="$2"

  if [ -z "$expected" ]; then
    return 0
  fi

  if command -v sha256sum >/dev/null 2>&1; then
    actual=$(sha256sum "$file_path" | awk '{print $1}')
  elif command -v shasum >/dev/null 2>&1; then
    actual=$(shasum -a 256 "$file_path" | awk '{print $1}')
  else
    echo "sha256sum or shasum is required to verify Grafana release assets" >&2
    exit 1
  fi

  if [ "$actual" != "$expected" ]; then
    echo "Checksum mismatch for $file_path" >&2
    echo "Expected: $expected" >&2
    echo "Actual:   $actual" >&2
    exit 1
  fi
}

resolve_download_metadata() {
  case "$TARGET_ARCH" in
    amd64)
      GRAFANA_TARBALL_URL="https://dl.grafana.com/oss/release/grafana-${GRAFANA_VERSION}.linux-amd64.tar.gz"
      GRAFANA_TARBALL_SHA256="${GRAFANA_TARBALL_SHA256:-97718f494722f35d8a6c728c5c7b52e0e96f632b8a94139e4022ed2efbe48732}"
      ;;
    arm64)
      GRAFANA_TARBALL_URL="https://dl.grafana.com/oss/release/grafana-${GRAFANA_VERSION}.linux-arm64.tar.gz"
      GRAFANA_TARBALL_SHA256="${GRAFANA_TARBALL_SHA256:-}"
      ;;
    *)
      echo "Unsupported Grafana download arch=${TARGET_ARCH}" >&2
      exit 1
      ;;
  esac
}

rm -rf "$SOURCE_DEB_DIR" "$SOURCE_PLUGINS_DIR" "$OUTPUT_DEB_DIR" "$DOWNLOAD_DIR"
mkdir -p "$SOURCE_DEB_DIR" "$SOURCE_PLUGINS_DIR" "$OUTPUT_DEB_DIR" "$DOWNLOAD_DIR"

cp -r "${CI_PROJECT_DIR}/package/DEBIAN" "${SOURCE_DEB_DIR}/"
cp -r "${CI_PROJECT_DIR}/package/files/." "${SOURCE_DEB_DIR}/"
cp -r "${CI_PROJECT_DIR}/${GRAFANA_VERSION}/." "${SOURCE_DEB_DIR}/usr/share/grafana/"

resolve_download_metadata

GRAFANA_TARBALL_NAME=$(basename "$GRAFANA_TARBALL_URL")
GRAFANA_TARBALL_PATH="${DOWNLOAD_DIR}/${GRAFANA_TARBALL_NAME}"
GRAFANA_EXTRACT_DIR="${DOWNLOAD_DIR}/extract"

download_file "$GRAFANA_TARBALL_URL" "$GRAFANA_TARBALL_PATH"
verify_sha256 "$GRAFANA_TARBALL_SHA256" "$GRAFANA_TARBALL_PATH"

mkdir -p "$GRAFANA_EXTRACT_DIR"
tar -xzf "$GRAFANA_TARBALL_PATH" -C "$GRAFANA_EXTRACT_DIR"

GRAFANA_RELEASE_DIR=$(find "$GRAFANA_EXTRACT_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)

if [ -z "$GRAFANA_RELEASE_DIR" ]; then
  echo "Unable to locate extracted Grafana release directory" >&2
  exit 1
fi

cp "$GRAFANA_RELEASE_DIR/bin/grafana-server" "${SOURCE_DEB_DIR}/usr/sbin/grafana-server"
chmod 755 "${SOURCE_DEB_DIR}/usr/sbin/grafana-server"

cp -r "${CI_PROJECT_DIR}/plugins/." "${SOURCE_PLUGINS_DIR}/"
chmod +x "$SOURCE_PLUGINS_DIR/build-plugins.sh" && "$SOURCE_PLUGINS_DIR/build-plugins.sh"

if [ -f "${CI_PROJECT_DIR}/version.txt" ]; then
  VERSION=$(cat "${CI_PROJECT_DIR}/version.txt")
else
  VERSION="$GRAFANA_VERSION"
fi

chmod -R 755 "$SOURCE_DEB_DIR"
echo "$VERSION" > "${SOURCE_DEB_DIR}/usr/share/grafana/VERSION"

sed -i "s/^Version:.*/Version: ${VERSION}/" "${SOURCE_DEB_DIR}/DEBIAN/control"
sed -i "s/^Architecture:.*/Architecture: ${TARGET_ARCH}/" "${SOURCE_DEB_DIR}/DEBIAN/control"

(
  cd "$SOURCE_DEB_DIR"
  find etc usr var -type f -print0 | LC_ALL=C sort -z | xargs -0 md5sum > DEBIAN/md5sums
)

PACKAGE_NAME=$(sed -n 's/^Package:[[:space:]]*//p' "${SOURCE_DEB_DIR}/DEBIAN/control" | head -n 1)

if [ -z "$PACKAGE_NAME" ]; then
  echo "Unable to determine package name from DEBIAN/control" >&2
  exit 1
fi

DEB_FILENAME="${PACKAGE_NAME}_${VERSION}_${TARGET_ARCH}.deb"
DEB_OUTPUT_PATH="${OUTPUT_DEB_DIR}/${DEB_FILENAME}"

dpkg-deb -b "$SOURCE_DEB_DIR" "$DEB_OUTPUT_PATH"
mv "$DEB_OUTPUT_PATH" "${CI_PROJECT_DIR}/${DEB_FILENAME}"

echo "Package created: ${CI_PROJECT_DIR}/${DEB_FILENAME}"
