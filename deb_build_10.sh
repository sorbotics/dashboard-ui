#!/bin/sh

# Transit package for the 8.4.3 -> 10.4 -> 13 upgrade path. Do not publish.

set -eu

GRAFANA_VERSION="10.4.19"
GRAFANA_SRC="${GRAFANA_VERSION}/grafana-${GRAFANA_VERSION}"
# The 10.x release tarball prefixes its top-level directory with "v".
TARBALL_PREFIX="grafana-v${GRAFANA_VERSION}"

TARGET_ARCH="${TARGET_ARCH:-${PACKAGE_ARCH:-amd64}}"
SOURCE_DEB_DIR="$HOME/dashboard-10-${TARGET_ARCH}"
SOURCE_PLUGINS_DIR="$HOME/dashboard-10-plugins-${TARGET_ARCH}"
DOWNLOAD_DIR="$HOME/dashboard-10-downloads-${TARGET_ARCH}"
GRAFANA_HOME="${SOURCE_DEB_DIR}/usr/share/grafana"

if [ -z "${CI_PROJECT_DIR:-}" ]; then
  CI_PROJECT_DIR=$(pwd)
fi

case "$TARGET_ARCH" in
  x86_64)
    TARGET_ARCH="amd64"
    ;;
  aarch64)
    TARGET_ARCH="arm64"
    ;;
esac

# Copied whole-directory from GRAFANA_SRC/public/ into the package; the rest of public/ is monorepo source, already covered by the release.
SORBA_PUBLIC_PATHS="build dashboards views img vendor"

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
      GRAFANA_TARBALL_SHA256="${GRAFANA_TARBALL_SHA256:-110006a65a90195bcb7fe5a8b53ca152a26b6179454a5fd137be093c24244ef8}"
      ;;
    arm64)
      GRAFANA_TARBALL_URL="https://dl.grafana.com/oss/release/grafana-${GRAFANA_VERSION}.linux-arm64.tar.gz"
      GRAFANA_TARBALL_SHA256="${GRAFANA_TARBALL_SHA256:-d2f66406aa71399fa84970bb99b971dffb0c82db702424bee1308fc26a3a650e}"
      ;;
    *)
      echo "Unsupported Grafana download arch=${TARGET_ARCH}" >&2
      exit 1
      ;;
  esac
}

for f in "${CI_PROJECT_DIR}/package/DEBIAN/control" \
         "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/custom.ini" \
         "${CI_PROJECT_DIR}/version_10.txt"; do
  if [ ! -f "$f" ]; then
    echo "Missing $f" >&2
    exit 1
  fi
done

# public/build/ is the committed compiled frontend
if [ ! -d "${CI_PROJECT_DIR}/${GRAFANA_SRC}/public/build" ]; then
  echo "Missing ${GRAFANA_SRC}/public/build -- run yarn build in ${GRAFANA_SRC} first" >&2
  exit 1
fi

rm -rf "$SOURCE_DEB_DIR" "$SOURCE_PLUGINS_DIR" "$DOWNLOAD_DIR"
mkdir -p "$GRAFANA_HOME" "$SOURCE_PLUGINS_DIR" "$DOWNLOAD_DIR"

cp -r "${CI_PROJECT_DIR}/package/DEBIAN" "${SOURCE_DEB_DIR}/"
cp -r "${CI_PROJECT_DIR}/package/files/." "${SOURCE_DEB_DIR}/"

resolve_download_metadata

GRAFANA_TARBALL_NAME=$(basename "$GRAFANA_TARBALL_URL")
GRAFANA_TARBALL_PATH="${DOWNLOAD_DIR}/${GRAFANA_TARBALL_NAME}"

if [ ! -f "$GRAFANA_TARBALL_PATH" ]; then
  download_file "$GRAFANA_TARBALL_URL" "$GRAFANA_TARBALL_PATH"
fi
verify_sha256 "$GRAFANA_TARBALL_SHA256" "$GRAFANA_TARBALL_PATH"

tar -xzf "$GRAFANA_TARBALL_PATH" -C "$GRAFANA_HOME" --strip-components=1 \
  --exclude="${TARBALL_PREFIX}/docs" \
  --exclude="${TARBALL_PREFIX}/packaging" \
  --exclude="${TARBALL_PREFIX}/Dockerfile" \
  --exclude="${TARBALL_PREFIX}/npm-artifacts" \
  --exclude="${TARBALL_PREFIX}/storybook"

# sample.yaml is never read; start-grafana forces cfg:paths.provisioning.
rm -f "${GRAFANA_HOME}/conf/sample.ini"
rm -rf "${GRAFANA_HOME}/conf/provisioning/sample"
find "${GRAFANA_HOME}/conf/provisioning" -name 'sample.yaml' -delete 2>/dev/null || true

# 8.4.3 leftovers from package/files; the release ships its own bin/grafana-cli.
rm -rf "${GRAFANA_HOME}/scripts" "${GRAFANA_HOME}/plugins-bundled/internal"

# Only plugin.json, dist/, and img/ are needed at runtime from public/app/.
find "${GRAFANA_HOME}/public/app" -type f \
  \( -name '*.ts' -o -name '*.tsx' -o -name '*.map' -o -name '*.md' \
     -o -name '*.mdx' -o -name '*.snap' -o -name '*.cue' -o -name '*.txt' \) \
  -delete
rm -rf "${GRAFANA_HOME}/public/test" "${GRAFANA_HOME}/public/sass"
rm -f "${GRAFANA_HOME}/public/api-merged.json" \
      "${GRAFANA_HOME}/public/api-enterprise-spec.json" \
      "${GRAFANA_HOME}/public/openapi3.json"
find "${GRAFANA_HOME}/public/app" -type d -empty -delete 2>/dev/null || true

# Sorba's bundle and the release's have different chunk hashes; don't mix them.
rm -rf "${GRAFANA_HOME}/public/build"

for pth in $SORBA_PUBLIC_PATHS; do
  src="${CI_PROJECT_DIR}/${GRAFANA_SRC}/public/${pth}"
  if [ ! -e "$src" ]; then
    echo "Missing ${src}" >&2
    exit 1
  fi
  dest_parent="${GRAFANA_HOME}/public/$(dirname "$pth")"
  mkdir -p "$dest_parent"
  rm -rf "${GRAFANA_HOME}/public/${pth}"
  cp -r "$src" "$dest_parent/"
done

# custom.ini is required; without it postinst falls back to upstream defaults.ini.
cp "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/custom.ini" "${GRAFANA_HOME}/conf/custom.ini"

if [ -f "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/provisioning/datasources/influx_data.yaml" ]; then
  mkdir -p "${GRAFANA_HOME}/conf/provisioning/datasources"
  cp "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/provisioning/datasources/influx_data.yaml" \
     "${GRAFANA_HOME}/conf/provisioning/datasources/"
fi

# Skip node_modules/dist; a foreign node_modules has broken .bin/ shims. build-plugins.sh installs fresh.
( cd "${CI_PROJECT_DIR}/plugins" && tar -cf - --exclude=node_modules --exclude=dist . ) \
  | ( cd "$SOURCE_PLUGINS_DIR" && tar -xf - )
SOURCE_GRAFANA_DIR="$SOURCE_DEB_DIR"
export SOURCE_GRAFANA_DIR
chmod +x "$SOURCE_PLUGINS_DIR/build-plugins.sh" && ( cd "$SOURCE_PLUGINS_DIR" && ./build-plugins.sh )

# Source maps are ~67% of the bundle; SORBA_KEEP_SOURCEMAPS=1 keeps them.
# Limited to public/: signed plugins list their .map files in MANIFEST.txt.
if [ "${SORBA_KEEP_SOURCEMAPS:-0}" != "1" ]; then
  find "${GRAFANA_HOME}/public" -name "*.map" -delete
fi

if [ -f "${CI_PROJECT_DIR}/version_10.txt" ]; then
  VERSION=$(cat "${CI_PROJECT_DIR}/version_10.txt")
else
  VERSION="${GRAFANA_VERSION}-1"
fi

chmod -R 755 "$SOURCE_DEB_DIR"
chmod 644 "${GRAFANA_HOME}/conf/custom.ini"

# Cross-arch builds can't execute the target binary, so the check only runs on native builds.
if "${GRAFANA_HOME}/bin/grafana" --version >/dev/null 2>&1; then
  CLI_VERSION=$("${GRAFANA_HOME}/bin/grafana-cli" -v 2>&1 || true)
  case "$CLI_VERSION" in
    *"$GRAFANA_VERSION"*) ;;
    *)
      echo "bin/grafana-cli reports '${CLI_VERSION}', expected ${GRAFANA_VERSION}" >&2
      exit 1
      ;;
  esac
else
  echo "Skipping grafana-cli version check: cannot run ${TARGET_ARCH} binary on this host" >&2
fi
echo "$VERSION" > "${GRAFANA_HOME}/VERSION"

sed -i "s/^Version:.*/Version: ${VERSION}/" "${SOURCE_DEB_DIR}/DEBIAN/control"
sed -i "s/^Architecture:.*/Architecture: ${TARGET_ARCH}/" "${SOURCE_DEB_DIR}/DEBIAN/control"

(
  cd "$SOURCE_DEB_DIR"
  find etc usr var -type f -print0 | LC_ALL=C sort -z | xargs -0 md5sum > DEBIAN/md5sums
)

INSTALLED_SIZE=$(du -sk "$SOURCE_DEB_DIR" | awk '{ print $1 }')
sed -i "s/^Installed-Size:.*/Installed-Size: ${INSTALLED_SIZE}/" "${SOURCE_DEB_DIR}/DEBIAN/control"

PACKAGE_NAME=$(sed -n 's/^Package:[[:space:]]*//p' "${SOURCE_DEB_DIR}/DEBIAN/control" | head -n 1)

if [ -z "$PACKAGE_NAME" ]; then
  echo "Unable to determine package name from DEBIAN/control" >&2
  exit 1
fi

DEB_FILENAME="${PACKAGE_NAME}_${VERSION}_${TARGET_ARCH}.deb"
dpkg-deb -b "$SOURCE_DEB_DIR" "${CI_PROJECT_DIR}/${DEB_FILENAME}"

echo "Package created: ${CI_PROJECT_DIR}/${DEB_FILENAME}"
