# Deploy and Configure Kibana for an Elasticsearch Cluster

## Install Kibana on the master-1 node
```bash
sudo apt-get install kibana
```

## Configure Kibana
Open the kibana.yml file:
```bash
sudo vi /etc/kibana/kibana.yml
```

Apply the following configurations
```bash
#server.port: 5601
server.port: 8080

#server.host: "localhost"
server.host: "172.31.7.48"
```

## Start kibana
```bash
sudo systemctl enable kibana
sudo systemctl start kibana
sudo systemctl status kibana
```

Now the kibana should be reachable via `http://PUBLIC_IP_ADDRESS_OF_MASTER-1:8080`
Run `GET _cat/nodes?v` to verify the es cluster

```bash
#! Elasticsearch built-in security features are not enabled. Without authentication, your cluster could be accessible to anyone. See https://www.elastic.co/guide/en/elasticsearch/reference/7.17/security-minimal-setup.html to enable security.
ip            heap.percent ram.percent cpu load_1m load_5m load_15m node.role  master name
172.31.7.48             59          94   9    0.21    0.47     0.64 cdfhimrstw *      master-1
172.31.12.114           60          61   6    0.15    0.16     0.11 cdfhrstw   -      data-2
172.31.14.121           21          60  15    0.20    0.18     0.23 cdfhrstw   -      data-1
```