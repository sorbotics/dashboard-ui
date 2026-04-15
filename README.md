# Building Grafana from source
This guide will help you obtain grafana for operation in the dev environment. Grafana is sent with its own backend server required; # Also completely open source. It is written in Go and has a complete HTTP API.

# Dependencies
Go (Latest Stable)
Git
NodeJS LTS

# Get Code
Create a directory for the project and set your path accordingly (or use the default Go workspace directory: 
https://golang.org/doc/code.html#GOPATH). Then download and install Grafana into your $GOPATH directory:

export GOPATH=`pwd`
go get github.com/grafana/grafana

# Building the backend
cd $GOPATH/src/github.com/grafana/grafana
go run build.go setup
go run build.go build              # (or 'go build ./pkg/cmd/grafana-server')

# Update Frontend with the sorba changes:
cd $GOPATH/src
mkdir gitlab.sorbasoft.net
cd gitlab.sorbasoft.net/
mkdir sorbotics
cd sorbotics/
git clone https://gitlab.sorbasoft.net/sorbotics/dashboard/dashboard-ui.git
cd dashboard-ui/
cp -r public/ $GOPATH/src/github.com/grafana/grafana
cd $GOPATH/src/github.com/grafana/grafana

# Build the Frontend Assets
For this you need nodejs (v.6+).
npm install -g yarn
yarn install --pure-lockfile
yarn watch

# Running Grafana Locally
You can run a local instance of Grafana by running:
./bin/grafana-server
Or, if you built the binary with go run build.go build, run ./bin/<os>-<architecture>/grafana-server
If you built it with go build ., run ./grafana
Open grafana in your browser (default http://localhost:3000) and login with admin user (default user/pass = admin/admin).

# Developing Grafana
To add features, customize your config, etc, visit http://docs.grafana.org/project/building_from_source/