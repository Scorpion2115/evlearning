# Install Node Exporter

Exporters are sources of metric data that Prometheus periodically collects

## Create a user for Node Exporter
```bash
sudo useradd -M -r -s /bin/false node_exporter
```

## Download and extract the Node Exporter binary:
1. Download binary from Github: [Node exporter](https://github.com/prometheus/node_exporter/releases/)
```bash
wget https://github.com/prometheus/node_exporter/releases/download/v1.3.1/node_exporter-1.3.1.linux-amd64.tar.gz
```
2. Extract the binary file
```bash
tar xvfz node_exporter-1.3.1.linux-amd64.tar.gz 
```
## Copy the Node Exporter binary to the appropriate location and set ownership:
1. copy to destination
```bash
sudo cp node_exporter-1.3.1.linux-amd64/node_exporter /usr/local/bin/
```
2. set ownership
```bash
# sudo chown user:group /usr/local/bin/node_exporter
sudo chown node_exporter:node_exporter /usr/local/bin/node_exporter
```

## Create a systemd unit file for Node Exporter:
1. create a `systemd unit file for node exporter
```bash
sudo vi /etc/systemd/system/node_exporter.service
```

2. Define the node exporter service
```bash
[Unit]
Description=Prometheus Node Exporter 
Wants=network-online.target 
After=network-online.target

[Service]
User=node_exporter 
Group=node_exporter
Type=simple 
ExecStart=/usr/local/bin/node_exporter

[Install] WantedBy=multi-user.target
```

## Start and enable the node_exporter service:
```bash
sudo systemctl daemon-reload
sudo systemctl start node_exporter
sudo systemctl enable node_exporter
sudo systemctl status node_exporter
```

You can retrieve the metrics served by Node Exporter like so:
```bash
curl localhost:9100/metrics
```

## Configure Prometheus to Scrape Metrics
1. Locate the `scrape_configs` section in `prometheus.yml` and add a new entry under that section.
```yml
- job_name: 'you-know-who'
static_configs:
- targets: ['<Host IP>:9100']
```
Apply the change and restart kubernetes deployment
```bash
kubectl apply -f prometheus-config-map.yml

kubectl rollout restart deploy prometheus-deployment -n monitoring
```

## Verify
1. up{instance=""}: give the status of each instance
![img](./img/up.jpg)
2. node_filesystem_avail_bytes: the number of bytes available in different partition of filesystem
![img](./img/node_filesystem_avail_bytes.jpg)


## Reference
* [How To Monitor Linux Servers Using Prometheus Node Exporter](https://devopscube.com/monitor-linux-servers-prometheus-node-exporter/)