#!/usr/bin/bash

if [[ -d $SOURCE_PLUGINS_DIR ]]; then
  for plugin in plugins/*/; do
    echo "Building plugin: ${plugin}"
    cd $plugin
    npm install
    npm run build
    PLUGIN_NAME=$(basename $plugin)
    PLUGIN_FOLDER="${SOURCE_GRAFANA_DIR}/var/lib/grafana/plugins/${PLUGIN_NAME}"
    mkdir -p $PLUGIN_FOLDER
    cp -R dist/* $PLUGIN_FOLDER/
  done
fi

