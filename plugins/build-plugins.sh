#!/usr/bin/bash

# Build each custom plugin in plugins/<name>/ (relative to cwd) and copy the
# dist/ to $SOURCE_GRAFANA_DIR/var/lib/grafana/plugins/<name>/.
# Supports both yarn and npm based plugins (detects via yarn.lock vs package-lock.json).
#
# Expects to be run with cwd = $SOURCE_PLUGINS_DIR (the parent of plugins/).
# The deb_build_13.sh script sets cwd before invoking this.
#
# Exits non-zero if any plugin fails to build: a package with an empty plugin
# dir breaks every dashboard panel of that type ("Panel plugin not found").

if compgen -G "*/" > /dev/null; then
  for plugin in */; do
    # Skip non-plugin dirs (build-plugins.sh itself, etc.)
    [[ -f "$plugin/package.json" ]] || continue
    echo "Building plugin: ${plugin}"
    cd "$plugin" || exit 1
    PLUGIN_NAME=$(basename "$plugin")
    BUILD_LOG=$(mktemp)

    # Prefer yarn if yarn.lock exists, otherwise npm
    if [[ -f "yarn.lock" ]]; then
      echo "  -> using yarn"
      { yarn install --frozen-lockfile && yarn build; } >"$BUILD_LOG" 2>&1
    else
      echo "  -> using npm"
      { npm install && npm run build; } >"$BUILD_LOG" 2>&1
    fi
    BUILD_STATUS=$?

    if [[ $BUILD_STATUS -ne 0 || ! -f "dist/module.js" ]]; then
      echo "  !! ERROR: ${PLUGIN_NAME} build failed (exit ${BUILD_STATUS}); last lines:" >&2
      tail -30 "$BUILD_LOG" >&2
      rm -f "$BUILD_LOG"
      exit 1
    fi
    tail -3 "$BUILD_LOG"
    rm -f "$BUILD_LOG"

    PLUGIN_FOLDER="${SOURCE_GRAFANA_DIR}/var/lib/grafana/plugins/${PLUGIN_NAME}"
    mkdir -p "$PLUGIN_FOLDER"
    cp -R dist/* "$PLUGIN_FOLDER/"
    echo "  -> dist/ copied to $PLUGIN_FOLDER"
    cd - >/dev/null
  done
else
  echo "No plugins/*/ found in $(pwd); nothing to build"
fi
