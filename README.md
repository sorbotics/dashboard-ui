# SORBA Dashboard UI

This repository contains a customized version of Grafana used as part of the Sorbotics platform.

## Overview

- Based on Grafana 8.4.3
- Includes custom UI modifications and integrations
- Distributed as:
  - Debian package (.deb)
  - Red Hat package (.rpm)
  - Docker image

## License

This project includes a modified version of Grafana, which is licensed under the GNU Affero General Public License v3 (AGPLv3).

The complete corresponding source code for this distributed and deployed version is available in this repository:
https://github.com/sorbotics/dashboard-ui

This project is not affiliated with or endorsed by Grafana Labs.

## Repository Structure

- `8.4.3/` — Grafana source base
- `package/` — Packaging configuration (DEB and RPM)
- `plugins/` — Custom plugins and build scripts
- `deb_build.sh` — Debian package build script
- `rpm-build.sh` — RPM package build script

## Building Packages

### Debian

```bash
TARGET_ARCH=amd64 ./deb_build.sh
TARGET_ARCH=arm64 ./deb_build.sh
```

The Debian build script downloads the official Grafana `8.4.3` release tarball and extracts `grafana-server` during packaging.

- `TARGET_ARCH` accepts `amd64` or `arm64` and updates the `.deb` metadata accordingly.
- By default it uses Grafana OSS assets from `dl.grafana.com`.
- You can switch to enterprise assets with `GRAFANA_DOWNLOAD_CHANNEL=enterprise`.
- You can override the expected SHA256 with `GRAFANA_TARBALL_SHA256` if you need to pin a verified checksum externally.

```bash
TARGET_ARCH=arm64 \
GRAFANA_DOWNLOAD_CHANNEL=enterprise \
./deb_build.sh
```

### RPM

```bash
./rpm_build.sh
```

### Docker Image

The Docker image is built using GitHub Actions and published to Azure Container Registry (ACR).

### CI/CD

Builds are triggered on Git tags (`v*`) and can also be executed manually via GitHub Actions.

## Disclaimer

This is a fork of Grafana with custom modifications. It should not be confused with the official Grafana project.
