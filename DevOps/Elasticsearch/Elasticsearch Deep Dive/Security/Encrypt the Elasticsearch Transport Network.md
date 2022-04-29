# Encrypt the Elasticsearch Transport Network
## Create your own PKI
1. Create a CA (certificate Ahtority) to a specific path with a passcode
```bash
sudo /usr/share/elasticsearch/bin/elasticsearch-certutil ca --out /etc/elasticsearch/ca --pass elastic_ca
```
2. Use the CA to generate other certificates.
```bash
# find the dns
hostname
#5dad3b3c451c.mylabserver.com


# Bt defing the dns and ip address, this certificate will only work on this specific dns and ip address

# For master-1
sudo /usr/share/elasticsearch/bin/elasticsearch-certutil cert --ca /etc/elasticsearch/ca --ca-pass elastic_ca --name master-1 --dns 5dad3b3c451c.mylabserver.com --ip 172.31.7.48 --out /etc/elasticsearch/master-1 --pass elastic_master_1

# For data-1
sudo /usr/share/elasticsearch/bin/elasticsearch-certutil cert --ca /etc/elasticsearch/ca --ca-pass elastic_ca --name data-1 --dns 5dad3b3c452c.mylabserver.com --ip 172.31.14.121 --out /etc/elasticsearch/data-1 --pass elastic_data_1

# For data-2
sudo /usr/share/elasticsearch/bin/elasticsearch-certutil cert --ca /etc/elasticsearch/ca --ca-pass elastic_ca --name data-2 --dns 5dad3b3c453c.mylabserver.com --ip 172.31.12.114 --out /etc/elasticsearch/data-2 --pass elastic_data_2

# verify
cloud_user@5dad3b3c451c:~$ sudo tree  /etc/elasticsearch/
/etc/elasticsearch/
├── ca
├── data-1
├── data-2
├── ...
├── master-1
├── ...
```

3. Distribute the certificates to each node
* Check the ownership
```bash
# check the ownership
ll /tmp
...
drwxrwxrwt  2 root       root       4096 Mar 28 22:11 .XIM-unix/
drwxrwxrwt  2 root       root       4096 Mar 28 22:11 .font-unix/
-rw-------  1 cloud_user cloud_user  494 Mar 28 22:12 .xfsm-ICE-653SJ1
-rw-------  1 root elasticsearch 3624 Mar 29 00:38 data-1
-rw-------  1 root elasticsearch 3624 Mar 29 00:39 data-2
...
```

* Change the ownership from root to a qualified user, as in case we don't have root password
```bash
# change the ownership from root to a qualified user, as in case we don't have root password
sudo mv /etc/elasticsearch/data-1 /tmp/data-1
sudo chown cloud_user:cloud_user /tmp/data-1

sudo mv /etc/elasticsearch/data-2 /tmp/data-2
sudo chown cloud_user:cloud_user /tmp/data-2
```

* verify the change of the ownership
```bash
# verify the change of the ownership
ll /tmp
...
drwxrwxrwt  2 root       root       4096 Mar 28 22:11 .XIM-unix/
drwxrwxrwt  2 root       root       4096 Mar 28 22:11 .font-unix/
-rw-------  1 cloud_user cloud_user  494 Mar 28 22:12 .xfsm-ICE-653SJ1
-rw-------  1 cloud_user cloud_user 3624 Mar 29 00:38 data-1
-rw-------  1 cloud_user cloud_user 3624 Mar 29 00:39 data-2
...
```

* Distribute the certificates to other node
```bash
# distribute the certificates to other node
# no sudo here, as we do the copy as cloud_user
scp /tmp/data-1 3.106.143.77:/tmp
scp /tmp/data-2 13.54.96.125:/tmp
```

* Change the ownership back to root/elasticsearch
```bash
# on data-1
sudo chown root:elasticsearch /tmp/data-1
sudo mv /tmp/data-1 /etc/elasticsearch/

# on data-2
sudo chown root:elasticsearch /tmp/data-2
sudo mv /tmp/data-2 /etc/elasticsearch/
```

## Configure transport network encryption
1. Give elasticsearch group access to the certificate
```bash
# On Master-1
# pre check, elasticsearch user in the elasticsearch group does not have read right to the certificates
sudo ls -l /etc/elasticsearch/

-rw------- 1 root elasticsearch  3644 Mar 29 00:32 master-1

# change mode
sudo chmod 640 /etc/elasticsearch/master-1

# post check
-rw-r----- 1 root elasticsearch  3644 Mar 29 00:32 master-1


# On data-1
# pre check, elasticsearch user in the elasticsearch group does not have read right to the certificates
sudo ls -l /etc/elasticsearch/

-rw------- 1 root elasticsearch  3624 Mar 29 01:10 data-1

# change mode
sudo chmod 640 /etc/elasticsearch/data-1

# post check
-rw-r----- 1 root elasticsearch  3624 Mar 29 01:10 data-1


# On data-2
# pre check, elasticsearch user in the elasticsearch group does not have read right to the certificates
sudo ls -l /etc/elasticsearch/

-rw------- 1 root elasticsearch  3624 Mar 29 01:11 data-2

# change mode
sudo chmod 640 /etc/elasticsearch/data-2

# post check
-rw-r----- 1 root elasticsearch  3624 Mar 29 01:11 data-2
```

2. On each node, open the elasticsearch.yml file and add following configurations
```bash
sudo vim /etc/elasticsearch/elasticsearch.yml
```

`Master-1`
```bash
# --------------------------------- Security -----------------------------------
#
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: master-1
xpack.security.transport.ssl.keystore.password: elastic_master_1
xpack.security.transport.ssl.truststore.path: master-1
xpack.security.transport.ssl.truststore.password: elastic_master_1
```

`Data-1`
```bash
# --------------------------------- Security -----------------------------------
#
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: data-1
xpack.security.transport.ssl.keystore.password: elastic_data_1
xpack.security.transport.ssl.truststore.path: data-1
xpack.security.transport.ssl.truststore.password: elastic_data_1
```

`Data-2`
```bash
# --------------------------------- Security -----------------------------------
#
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: data-2
xpack.security.transport.ssl.keystore.password: elastic_data_2
xpack.security.transport.ssl.truststore.path:data-2
xpack.security.transport.ssl.truststore.password: elastic_data_2
```

## Set Build-in User Passwords
```bash
sudo /usr/share/elasticsearch/bin/elasticsearch-setup-passwords interactive
```

```bash
sudo vi /etc/kibana/kibana.yml

#elasticsearch.username: "kibana_system"
#elasticsearch.password: "pass"
elasticsearch.username: "kibana_system"
elasticsearch.password: "helloworld"
```


## Restart Elasticsearch
```bash
sudo systemctl stop elasticsearch
sudo systemctl start elasticsearch

sudo systemctl restart elasticsearch
sudo systemctl status elasticsearch

sudo less +G /var/log/elasticsearch/cluster-1.log

# verify the cluster
curl --user elastic:helloworld -XGET 'localhost:9200/_cat/nodes?v'
```