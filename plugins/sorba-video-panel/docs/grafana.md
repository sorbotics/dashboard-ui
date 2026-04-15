## Initialization

To initialize the plugin, follow these steps:

1. Run the following command to start the Docker containers:

```
docker-compose up -d
```

2. View the logs of the `sorba-video-panel` container using the following command:

```
docker logs sorba-video-panel
```

3. Execute the following command to access the Grafana CLI:

```
docker exec -it sorba-video-panel grafana-cli --config /etc/grafana/grafana.ini
```

4. Restart the `sorba-video-panel` container using the following command:

```
docker restart sorba-video-panel
```

## Plugin Location

The Sorba Video Panel plugin is located at the following path:

```
/var/lib/grafana/plugins/sorba-video-panel
```

## Copy via SSH

To copy the Sorba Video Panel plugin via SSH, use the following command:

```bash
scp -r ./dist/* root@192.168.1.1:/var/lib/grafana/plugins/sorba-video-panel
```
