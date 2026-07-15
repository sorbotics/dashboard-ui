#!/usr/bin/bash

# Build each custom plugin in plugins/<name>/ (relative to cwd) and copy the
# dist/ to $SOURCE_GRAFANA_DIR/var/lib/grafana/plugins/<name>/.
# Supports both yarn and npm based plugins (detects via yarn.lock vs package-lock.json).
#
# Expects to be run with cwd = $SOURCE_PLUGINS_DIR (the parent of plugins/).
# The deb_build_13.sh script sets cwd before invoking this.

if compgen -G "*/" > /dev/null; then
  for plugin in */; do
    # Skip non-plugin dirs (build-plugins.sh itself, etc.)
    [[ -f "$plugin/package.json" ]] || continue
    echo "Building plugin: ${plugin}"
    cd "$plugin" || continue
    PLUGIN_NAME=$(basename "$plugin")

    # Prefer yarn if yarn.lock exists, otherwise npm
    if [[ -f "yarn.lock" ]]; then
      echo "  -> using yarn"
      yarn install --frozen-lockfile 2>&1 | tail -3
      yarn build 2>&1 | tail -3
    else
      echo "  -> using npm"
      npm install 2>&1 | tail -3
      npm run build 2>&1 | tail -3
    fi

    PLUGIN_FOLDER="${SOURCE_GRAFANA_DIR}/var/lib/grafana/plugins/${PLUGIN_NAME}"
    mkdir -p "$PLUGIN_FOLDER"
    if [[ -d "dist" ]]; then
      cp -R dist/* "$PLUGIN_FOLDER/"
      echo "  -> dist/ copied to $PLUGIN_FOLDER"
    else
      echo "  !! WARNING: no dist/ directory produced, skipping copy"
    fi
    cd - >/dev/null
  done
else
  echo "No plugins/*/ found in $(pwd); nothing to build"
fi
