# From Ubuntu to Mac
```bash
scp evan@10.223.90.111:/home/evan/prometheus/namespaces.yml .
scp -r evan@10.223.90.111:/home/evan/prometheus/ .
```

# From Mac to Ubuntu
```bash
scp alertmanager-configmap.yml  evan@10.223.90.111:/home/evan/prometheus/alertmanager
```