# Prometheus Basics
## What is Prometheus
Prometheus is an open-source monitoring and alerting tool.

It collects data about applications and systems and allows you visualize the data and issue alerts based on the data

## Prometheus Architecture
![img](./img/k8s_prometheus_architecture.jpg)

Two most basic components of a Prometheus system are:
* Prometheus server: a central server that gathers metrics and makes them available
* Exporters: agents that expose data about systems and applications for collection by the prometheus server.

Prometheus uses a `pull` model to collect data
## Prometheus Use Cases
* Metric Collection
* Visualization
* Alerting