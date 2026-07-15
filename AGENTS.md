# AGENTS.md

This repo packages a customized fork of Grafana for the Sorbotics platform.
Source is not built here — both Grafana versions are vendored as pre-built trees.

## Two parallel Grafana streams in tree

| Stream | Source dir | Version file | Build script |
| --- | --- | --- | --- |
| 8.4.3 (legacy) | `8.4.3/` (only `conf/` + prebuilt `public/build/`) | `version.txt` | `deb_build.sh`, `rpm_build.sh` |
| 13.0.2 (current) | `13.0.2/grafana-13.0.2/` (full upstream source) | `version_13.txt` | `deb_build_13.sh` |

`8.4.3/public/build/` is a pre-built webpack bundle (714+ chunked JS files in `8.4.3/public/build/`). Do not edit it directly; rebuild via the upstream Grafana 8.4.3 toolchain if needed.
`13.0.2/grafana-13.0.2/` already has `node_modules/` populated. It also ships its own upstream `AGENTS.md` and `CLAUDE.md` — read those for upstream Grafana guidance, but those files do not describe the Sorba-specific packaging in this repo.

## Build commands

Prereqs: `dpkg-dev`, `fakeroot`, `rpmbuild` (for RPM). `HOME` must be writable; both scripts stage files under `$HOME/dashboard` and `$HOME/plugins`.

```bash
# Debian, Grafana 8.4.3 stream
chmod +x deb_build.sh && ./deb_build.sh
# Debian, Grafana 13.0.2 stream
chmod +x deb_build_13.sh && ./deb_build_13.sh
# RPM (8.4.3 stream only — no 13.0.2 RPM script yet)
chmod +x rpm_build.sh && ./rpm_build.sh
```

- The version in `package/DEBIAN/control` (`Version: 8.4.3-9` default) is rewritten at build time from `version.txt` / `version_13.txt` via `sed`.
- `8.4.3/` is fully copied into the .deb at `usr/share/grafana/`. `13.0.2/grafana-13.0.2/` is partially copied: only `bin/`, prebuilt `public/{build,img,fonts,views,locales,emails,dashboards}`, and `conf/{defaults,sample,custom}.ini` + provisioning. Do not assume a full source-to-deb copy for 13.0.2.
- `deb_build_13.sh` expects the layout `13.0.2/grafana-13.0.2/{bin,public,conf}` (not `13.0.2/{bin,...}`).

## Plugins

- `plugins/sorba-video-panel/` — custom camera panel plugin (Grafana 9.2.5 scaffold via `@grafana/create-plugin`).
- `plugins/ae3e-plotly-panel/` — **Sorba fork of the original `ae3e-plotly-panel` v0.5.0** rebuilt for Grafana 13+. The plugin **id is kept as `ae3e-plotly-panel`** (same as the original) so existing dashboard JSONs that reference `vizConfig.group = "ae3e-plotly-panel"` work without any changes. The directory is named `ae3e-plotly-panel/` (not `sorba-plotly-panel/`) for the same reason — Grafana loads plugins by their `id`, and matching the original id means the legacy dashboards Just Work. Renders any Plotly chart from any datasource. Includes a `DataFrame[]` → legacy `data.series[].fields[].values.buffer` shim so existing Plotly scripts from the 8.4.3 era continue to work without modification. The original `ae3e-plotly-panel` is unmaintained (last release 2021-08-09) and incompatible with Grafana 13 (built for React 17 + old Grafana APIs). Source: `github.com/maikelf/ae3e-plotly-panel-fork`. Built with `yarn build` → `dist/module.js` (AMD format, bundles Plotly) + `plugin.json` + images.
- `plugins/build-plugins.sh` is invoked by `deb_build_13.sh` (and `deb_build.sh`): it iterates over `plugins/*/`, runs `yarn install && yarn build` (or `npm` if `yarn.lock` is missing), and drops the `dist/` into `$SOURCE_GRAFANA_DIR/var/lib/grafana/plugins/<name>/`. Expects to be run with cwd = `$HOME/plugins/`.
- Local plugin dev loop (applies to both `sorba-video-panel` and `ae3e-plotly-panel`):
  ```bash
  cd plugins/<name>
  yarn install        # node 18+ recommended
  yarn dev            # webpack watch + livereload (if available)
  yarn build          # production bundle
  ```
  For `sorba-plotly-panel` the dev script is a `webpack -w` invocation; tests are optional (the test file is a stub).

## CI/CD

- **GitHub Actions** (`.github/workflows/build.yml`): four jobs — `build-deb` (8.4.3, ubuntu-22.04), `build-rpm` (8.4.3, ubi9/nodejs-18 container), `docker-build` (pushes to ACR `sorbotics/dashboard/dashboard-ui/main`), and `release` (tag-only, attaches `.deb`/`.rpm` + `checksums.txt`).
  - Triggered on tag push `v*` and `workflow_dispatch` (with `push_images` input to force-push docker).
  - ACR registry is read from `secrets.ACR_REGISTRY_NAME` / `secrets.ACR_TOKEN` / `secrets.ACR_TOKEN_NAME`.
  - The workflow's `build-deb` job uses the 8.4.3 `deb_build.sh` only; there is no CI path for `deb_build_13.sh` yet.
- **GitLab CI** (`.gitlab-ci.yml`): only `include`s — no jobs defined locally. It pulls templates from `sorbotics/devops/ci-cd` for debian/rpm/docker build + deploy. Actual `CI_PROJECT_DIR` and `HOME` are set by the included templates, not here.

## Install / runtime behavior (where to look first)

- `package/DEBIAN/postinst` and `package/RPMBUILD/SPECS/sorba-dashboard-ui.spec` (`%post` section) define install-time behavior:
  - Creates `grafana` user/group if missing.
  - Stages `/etc/grafana/grafana.ini` from the package's `conf/` if absent.
  - Writes `/etc/supervisor/conf.d/dashboard-ui.conf` (program `dashboard-ui`, command `/usr/sbin/start-grafana`, logs to `/opt/log/dashboard-ui.log`).
  - Disables any existing systemd `grafana-server` service unit.
  - If `/usr/share/sorba-vision-ui` exists, flips `app_mode = development` in `grafana.ini`.
  - Removes legacy provisioning datasources `influxdb`, `sorbaml`, `sorbamlmysql` on upgrade.
  - Runs `supervisorctl reread && update` and `supervisorctl restart dashboard-ui`; reloads nginx.
- `package/files/usr/sbin/start-grafana` is the supervisor entrypoint — it exports `MYSQL_*` / `INFLUX_*` env (defaults to `127.0.0.1`, password `sbrQp10`) and execs `$GRAFANA_HOME/bin/grafana server`.
- `docker/run.sh` is the container entrypoint (the Grafana image's `run.sh` — not the one in `package/files/`). It waits for Redis, writes the build version to `app:sorba-dashboard-ui:version` in Redis, and starts `grafana-server` with MySQL + Influx + Redis env wiring.
- `Dockerfile` installs plugins via `grafana-cli` (default list in `ARG GF_INSTALL_PLUGINS`) and copies `8.4.3/conf/grafana.ini` and `8.4.3/public/` into the image — even though the base image is `grafana/grafana:8.4.3`, the 8.4.3 assets here are what runs. The 13.0.2 build does not produce a docker image.

## Layout cheatsheet

- `package/DEBIAN/{control,postinst,md5sums}` — Debian package metadata.
- `package/files/` — Filesystem tree installed by the package (`etc/grafana/`, `etc/nginx/apps.d/`, `usr/sbin/{grafana-cli,grafana-server,start-grafana}`, `usr/share/{doc/grafana,doc/sorba-dashboard-ui,grafana}`, `var/lib/grafana/plugins`).
- `package/RPMBUILD/SPECS/sorba-dashboard-ui.spec` — RPM spec; builds from `files.tar.gz` produced by `rpm_build.sh`.
- `docker/provisioning/datasources/sorba.yaml` — datasources provisioned in the Docker image (`sorba_ml`, `hot-data`, `sorba_ml_mysql`; deletes `Prometheus` and `InfluxDB` defaults).
- `8.4.3/conf/provisioning/datasources/influx_data.yaml` — provisioned datasource for the 8.4.3 deb (`influx_data`, default, db `sorba_sde`, `http://localhost:8086`).
- `8.4.3/conf/grafana.ini` — the `grafana.ini` baked into the deb and the docker image (`app_mode = development`, MySQL at `127.0.0.1:3306`, `root_url` at subpath `/dashboard/`, `serve_from_sub_path = true`).
- `13.0.2/grafana-13.0.2/conf/custom.ini` — overrides used for the 13.0.2 deb (none in `8.4.3/`).
- `version.txt`, `version_13.txt` — package version strings, read by build scripts and the GitHub docker job.

## Gotchas

- Do not bump `Version:` in `package/DEBIAN/control` by hand — it is overwritten from the version files.
- `8.4.3/` does not contain the Go backend (`bin/grafana-server` is a symlink/copy provided in `package/files/usr/sbin/`); the 8.4.3 deb relies on `package/files/` to provide the binary, while the 13.0.2 deb copies it from `13.0.2/grafana-13.0.2/bin/grafana`.
- The 8.4.3 build uses `chmod -R 755` on the staging dir; preserves permissions through `dpkg-deb -b`.
- `13.0.2/grafana-13.0.2/` and `13.0.2/grafana-13.0.2/node_modules/` are gitignored (see `.gitignore`) — these are populated per environment.
- **`kiosk=full` fix**: Grafana 13 dropped support for `kiosk=full` (only `kiosk=1`/`kiosk=true` work). The fix is applied in two places:
  1. `13.0.2/grafana-13.0.2/public/app/core/navigation/kiosk.ts` — add `case 'full':` to the switch.
  2. `13.0.2/grafana-13.0.2/public/build/2271*.js` (and `-react19*` variants) — patch the minified JS: replace `case"1":case!0:return` with `case"1":case!0:case"full":return`. Re-patch after any `yarn build` of Grafana frontend.
- License obligations: this is a modified Grafana (AGPLv3) — the README already links to the corresponding source on GitHub; do not remove that link.

## Pending cleanup

- `package/files/var/lib/grafana/plugins/{isaozler-paretochart-panel,natel-discrete-panel,yesoreyeram-boomtable-panel}` are the original AMD/RequireJS builds of these third-party plugins (vendored earlier in this repo's history). They are incompatible with Grafana 13 — installed but broken (config editor doesn't load). Candidates for removal — install them from the Grafana catalog instead. Removal: `rm -rf package/files/var/lib/grafana/plugins/{isaozler-paretochart-panel,natel-discrete-panel,yesoreyeram-boomtable-panel}`.
- `plugins/ae3e-plotly-panel/` source lives at `github.com/maikelf/ae3e-plotly-panel-fork` (independent repo, not a submodule).
