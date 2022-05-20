# Deploy Prometheus & Grafana on Kubernetes Cluster

## Prometheus
1. namespace
```bash
kubectl create ns monitoring
```

2. configmap
```bash
kubectl apply -f prometheus/prometheus-config-map.yml
```

3. deployment
```bash
kubectl apply -f prometheus/prometheus-deployment.yml
```
4. service
```bash
kubectl apply -f prometheus/prometheus-service.yml
```
5. clusterrole
```bash
kubectl apply -f prometheus/clusterRole.yml
```

6. kube-state-metrics
kube-state-metrics (KSM) is a simple service that listens to the Kubernetes API server and generates metrics about the state of the objects
```bash
kubectl apply -f prometheus/kube-state-metrics.yml
```

7. Install NodeExporters
The Prometheus Node Exporter exposes a wide variety of hardware- and kernel-related metrics.
[Prometheus Node Exporter](https://github.com/prometheus/node_exporter)
* option 1: 
```bash
sudo apt-get update
sudo apt-get install prometheus-node-exporter
```
* option 2 (not working T-T)
[Install Node Exporter](/Install%20Node%20Exporter.md)

## Grafana
1. deployment
```bash
kubectl apply -f grafana/grafana-deployment.yml
```

2. service
```bash
kubectl apply -f grafana/grafana-service.yml
```



## Reference
* [How to Setup Prometheus Monitoring On Kubernetes Cluster](https://devopscube.com/setup-prometheus-monitoring-on-kubernetes/)

* [content-kubernetes-prometheus-env](https://github.com/linuxacademy/content-kubernetes-prometheus-env)