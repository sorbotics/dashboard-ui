#!/bin/sh

set -eu

GRAFANA_VERSION="13.0.2"
GRAFANA_SRC="${GRAFANA_VERSION}/grafana-${GRAFANA_VERSION}"
GRAFANA_TARBALL_URL="https://dl.grafana.com/oss/release/grafana-${GRAFANA_VERSION}.linux-amd64.tar.gz"
GRAFANA_TARBALL_SHA256="${GRAFANA_TARBALL_SHA256:-6720d8b0b48d92e2b33b7bf30b38480c12964ccd87285e5e754aa554165edf2d}"

# Copied whole-directory from GRAFANA_SRC/public/ into the package; the rest of public/ is monorepo source, already covered by the release.
SORBA_PUBLIC_PATHS="build dashboards views img vendor"

SOURCE_FILES_DIR="$HOME/rpm-13-files"
SOURCE_PLUGINS_DIR="$HOME/rpm-13-plugins"
DOWNLOAD_DIR="$HOME/rpm-13-downloads"
SOURCE_RPM_DIR="$HOME/rpmbuild-13"
GRAFANA_HOME="${SOURCE_FILES_DIR}/usr/share/grafana"

if [ -z "${CI_PROJECT_DIR:-}" ]; then
  CI_PROJECT_DIR=$(pwd)
fi

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

for f in "${CI_PROJECT_DIR}/package/RPMBUILD/SPECS/sorba-dashboard-ui.spec" \
         "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/custom.ini" \
         "${CI_PROJECT_DIR}/version_13.txt"; do
  if [ ! -f "$f" ]; then
    echo "Missing $f" >&2
    exit 1
  fi
done

# public/build/ is the committed compiled frontend
if [ ! -d "${CI_PROJECT_DIR}/${GRAFANA_SRC}/public/build" ]; then
  echo "Missing ${GRAFANA_SRC}/public/build -- run ./build_frontend_13.sh first" >&2
  exit 1
fi

rm -rf "$SOURCE_FILES_DIR" "$SOURCE_PLUGINS_DIR" "$SOURCE_RPM_DIR" "$DOWNLOAD_DIR"
mkdir -p "$GRAFANA_HOME" "$SOURCE_PLUGINS_DIR" "$DOWNLOAD_DIR" "${SOURCE_RPM_DIR}/SOURCES"

cp -r "${CI_PROJECT_DIR}/package/files/." "${SOURCE_FILES_DIR}/"
cp -r "${CI_PROJECT_DIR}/package/RPMBUILD/." "${SOURCE_RPM_DIR}/"

GRAFANA_TARBALL_PATH="${DOWNLOAD_DIR}/$(basename "$GRAFANA_TARBALL_URL")"
if [ ! -f "$GRAFANA_TARBALL_PATH" ]; then
  download_file "$GRAFANA_TARBALL_URL" "$GRAFANA_TARBALL_PATH"
fi
verify_sha256 "$GRAFANA_TARBALL_SHA256" "$GRAFANA_TARBALL_PATH"

# Strip the grafana-13.0.2/ prefix; skip docs/, packaging/, and the release's own Dockerfile.
tar -xzf "$GRAFANA_TARBALL_PATH" -C "$GRAFANA_HOME" --strip-components=1 \
  --exclude="grafana-${GRAFANA_VERSION}/docs" \
  --exclude="grafana-${GRAFANA_VERSION}/packaging" \
  --exclude="grafana-${GRAFANA_VERSION}/Dockerfile"

# sample.yaml is never read; start-grafana forces cfg:paths.provisioning.
rm -f "${GRAFANA_HOME}/conf/sample.ini"
rm -rf "${GRAFANA_HOME}/conf/provisioning/sample"
find "${GRAFANA_HOME}/conf/provisioning" -name 'sample.yaml' -delete 2>/dev/null || true

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

# custom.ini is required; without it the postinstall falls back to upstream defaults.ini.
cp "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/custom.ini" "${GRAFANA_HOME}/conf/custom.ini"

if [ -f "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/provisioning/datasources/influx_data.yaml" ]; then
  mkdir -p "${GRAFANA_HOME}/conf/provisioning/datasources"
  cp "${CI_PROJECT_DIR}/${GRAFANA_SRC}/conf/provisioning/datasources/influx_data.yaml" \
     "${GRAFANA_HOME}/conf/provisioning/datasources/"
fi

# Skip node_modules/dist; a foreign node_modules has broken .bin/ shims. build-plugins.sh installs fresh.
( cd "${CI_PROJECT_DIR}/plugins" && tar -cf - --exclude=node_modules --exclude=dist . ) \
  | ( cd "$SOURCE_PLUGINS_DIR" && tar -xf - )
SOURCE_GRAFANA_DIR="$SOURCE_FILES_DIR"
export SOURCE_GRAFANA_DIR
chmod +x "$SOURCE_PLUGINS_DIR/build-plugins.sh" && ( cd "$SOURCE_PLUGINS_DIR" && ./build-plugins.sh )

# Source maps are ~67% of the bundle; SORBA_KEEP_SOURCEMAPS=1 keeps them.
if [ "${SORBA_KEEP_SOURCEMAPS:-0}" != "1" ]; then
  find "$SOURCE_FILES_DIR" -name "*.map" -delete
fi

FULL_VERSION=$(cat "${CI_PROJECT_DIR}/version_13.txt")
VERSION=$(echo "$FULL_VERSION" | cut -d'-' -f1)
RELEASE=$(echo "$FULL_VERSION" | cut -d'-' -f2)

chmod -R 755 "$SOURCE_FILES_DIR"
chmod 644 "${GRAFANA_HOME}/conf/custom.ini"
echo "$FULL_VERSION" > "${GRAFANA_HOME}/VERSION"

tar -czf "${SOURCE_RPM_DIR}/SOURCES/files.tar.gz" -C "$SOURCE_FILES_DIR" .

rpmbuild -bb \
  --define "_topdir ${SOURCE_RPM_DIR}" \
  --define "_version ${VERSION}" \
  --define "release ${RELEASE}" \
  "${SOURCE_RPM_DIR}/SPECS/sorba-dashboard-ui.spec"

mv "${SOURCE_RPM_DIR}"/RPMS/*/*.rpm "${CI_PROJECT_DIR}/"

echo "Package created: $(ls "${CI_PROJECT_DIR}"/sorba-dashboard-ui-"${VERSION}"-"${RELEASE}"*.rpm)"
