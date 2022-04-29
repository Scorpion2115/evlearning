# Encrypt the Client Network

## Configure client network encryption.
Edit `elasticsearch.yml` file
```bash
sudo vim /etc/elasticsearch/elasticsearch.yml
```

Add below lines to each node:

`Master-1`
```bash
xpack.security.http.ssl.enabled: true
xpack.security.http.ssl.keystore.path: master-1
xpack.security.http.ssl.truststore.path: master-1
```

`Data-1`
```bash
xpack.security.http.ssl.enabled: true
xpack.security.http.ssl.keystore.path: data-1
xpack.security.http.ssl.truststore.path: data-1
```

`Data-2`
```bash
xpack.security.http.ssl.enabled: true
xpack.security.http.ssl.keystore.path: data-2
xpack.security.http.ssl.truststore.path: data-2
```


## Add the password for your private key to the secure settings in Elasticsearch.
`Master-1`
```bash
sudo /usr/share/elasticsearch/bin/elasticsearch-keystore add xpack.security.http.ssl.keystore.secure_password
# elastic_master_1

sudo /usr/share/elasticsearch/bin/elasticsearch-keystore add xpack.security.http.ssl.truststore.secure_password
# elastic_master_1
```


`Data-1`
```bash
sudo /usr/share/elasticsearch/bin/elasticsearch-keystore add xpack.security.http.ssl.keystore.secure_password
# elastic_data_1

sudo /usr/share/elasticsearch/bin/elasticsearch-keystore add xpack.security.http.ssl.truststore.secure_password
# elastic_data_1
```

`Data-2`
```bash
sudo /usr/share/elasticsearch/bin/elasticsearch-keystore add xpack.security.http.ssl.keystore.secure_password
# elastic_data_2

sudo /usr/share/elasticsearch/bin/elasticsearch-keystore add xpack.security.http.ssl.truststore.secure_password
# elastic_data_2
```


## Restart Elasticsearch
```bash
sudo systemctl stop elasticsearch
sudo systemctl start elasticsearch

sudo systemctl restart elasticsearch
sudo systemctl status elasticsearch

sudo less +G /var/log/elasticsearch/cluster-1.log

# verify the cluster
curl --user elastic:helloworld --insecure -X GET "https://localhost:9200/_cat/nodes?v"
```

## Configure client network encryption for Kibana
Edit `/etc/kibana/kibana.yml` file
```bash
sudo vi /etc/kibana/kibana.yml
```

Apply below configurations
```bash
#elasticsearch.hosts: ["http://localhost:9200"]
elasticsearch.hosts: ["https://localhost:9200"]

# change to none if we use the self-signed certificates
#elasticsearch.ssl.verificationMode: full
elasticsearch.ssl.verificationMode: none
```
Restart kibana service
```bash
sudo systemctl restart kibana
sudo systemctl status kibana
```

## Alerting and action settings in Kibana
You must configure an encryption key to use Alerting
```bash
sudo /usr/share/kibana/bin/kibana-encryption-keys generate --interactive
```
Add the keys to `/etc/kibana/kibana.yml` file
```bash
sudo vi /etc/kibana/kibana.yml

xpack.encryptedSavedObjects.encryptionKey: 933ef6ba9d7d69c3798c244768b4826a
xpack.reporting.encryptionKey: 9afc1d7d7d436ac79ada4a86dae0c34c
xpack.security.encryptionKey: 8d7f2e0fcfb174ec8274b340ce269625
```

Restart kibana service
```bash
sudo systemctl restart kibana
sudo systemctl status kibana
```

