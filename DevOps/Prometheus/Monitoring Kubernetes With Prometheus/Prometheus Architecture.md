# Prometheus Architecture
![img](./img/k8s_prometheus_architecture.jpg)


## Client Library
![img](./img/k8s_prometheus_client_libs.jpg)
The client library sits in the application. 

The client libaray go and gather the metrics on your applcation and format them to what prometheus can understand

## Exporters
![img](./img/k8s_prometheus_exporters.jpg)
We use exporters to instrument applications which we don't have the source code for.


## Service Discovery and 
![img](./img/k8s_prometheus_service_discovery.jpg)

How does prometheus access to the metrics of the application? we can 
* define the target in prometheus configuration
* use service discovery

## Reference
[How to Setup Prometheus Monitoring On Kubernetes Cluster](https://devopscube.com/setup-prometheus-monitoring-on-kubernetes/)
