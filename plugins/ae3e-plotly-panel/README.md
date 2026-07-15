# ae3e-plotly-panel (Sorba fork)

Sorba's fork of [ae3e-plotly-panel](https://github.com/ae3e/ae3e-plotly-panel) v0.5.0, rebuilt for Grafana 13+.

The original plugin is unmaintained (last release 2021-08-09) and incompatible with Grafana 13 (built for React 17 + old Grafana APIs). This fork:

- Replaces `react-plotly.js` (React 17 class component) with a custom `PlotlyChart` function component that works with React 18/19
- Outputs **AMD** format for Grafana's SystemJS plugin loader
- Includes a **DataFrame-to-legacy shim** so existing scripts from the 8.4.3 era (using `data.series[].fields[].values.buffer`) work without modification
- Preserves the original plugin `id` (`ae3e-plotly-panel`) so existing dashboard JSONs referencing `vizConfig.group = "ae3e-plotly-panel"` work as-is

## Prerequisites

- Node.js 18+
- Yarn

## Build

```bash
cd plugins/ae3e-plotly-panel
yarn install
yarn build
```

Output: `dist/module.js` (AMD, ~4.5 MB, bundles Plotly) + `plugin.json` + images.

## Development

```bash
yarn dev    # webpack watch + livereload
```

## Integration with dashboard-ui build

`deb_build_13.sh` calls `plugins/build-plugins.sh`, which iterates over `plugins/*/` and runs `yarn install && yarn build`. The resulting `dist/` is copied into `$SOURCE_GRAFANA_DIR/var/lib/grafana/plugins/ae3e-plotly-panel/` inside the `.deb`.

## DataFrame-to-legacy shim

Grafana 13 passes `DataFrame[]` to panels, where `fields[].values` is a `Vector<T>`. The original ae3e-plotly-panel v0.5.0 expected `data.series[].fields[].values.buffer` (a plain Array).

The shim in `SimplePanel.tsx` converts Grafana 13's data format to the legacy shape, so existing scripts like:

```javascript
let x = data.series[0].fields[0].values.buffer
let y = data.series[0].fields[1].values.buffer
```

continue to work without modification.

## kiosk=full patches

Grafana 13 dropped support for `kiosk=full` (only `kiosk=1`/`kiosk=true` recognized). Two patches are required:

1. `13.0.2/grafana-13.0.2/public/app/core/navigation/kiosk.ts` — add `case 'full':` to the switch
2. `13.0.2/grafana-13.0.2/public/build/2271*.js` (and `-react19*` variants) — patch minified JS: replace `case"1":case!0:return` with `case"1":case!0:case"full":return`

Re-patch after any `yarn build` of Grafana frontend.

## unsigned plugins

Add to `/etc/grafana/grafana.ini`:

```ini
[plugins]
allow_loading_unsigned_plugins = ae3e-plotly-panel,sorba-video-panel,isaozler-paretochart-panel,natel-discrete-panel,yesoreyeram-boomtable-panel
```

## License

Apache-2.0 (same as original).
