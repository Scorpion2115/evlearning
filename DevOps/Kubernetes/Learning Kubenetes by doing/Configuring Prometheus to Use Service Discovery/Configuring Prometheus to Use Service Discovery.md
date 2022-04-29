# Configuring Prometheus to Use Service Discovery

## You will need to do the following:

* Configure the Service Discovery Targets
* Apply the Changes to the Prometheus Configuration Map
* Delete the Prometheus Pod

## Configure the Service Discovery Targets
Prepare the environment and create the monitoring namespace as below:
```bash
sudo su -
cd /root/prometheus

# view bootstrap.sh
vim bootstrap.sh
#kubectl apply -f clusterRole.yml
#kubectl apply -f namespaces.yml
#kubectl apply -f prometheus-config-map.yml
#kubectl apply -f prometheus-deployment.yml
#kubectl apply -f kube-state-metrics.yml

# execute the bootstrap file
./bootstrap.sh

kubectl get pods -n monitoring
```

Edit prometheus-config-map.yml and add in the two service discovery targets:
```bash
vi prometheus-config-map.yml

# delete all lines
:1,$d

# poste in the final version
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-server-conf
  labels:
    name: prometheus-server-conf
  namespace: monitoring
data:
  prometheus.yml: |-
    global:
      scrape_interval: 5s
      evaluation_interval: 5s

    scrape_configs:
      - job_name: 'kubernetes-apiservers'

        kubernetes_sd_configs:
        - role: endpoints
        scheme: https

        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token

        relabel_configs:
        - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
          action: keep
          regex: default;kubernetes;https

      - job_name: 'kubernetes-cadvisor'

        scheme: https

        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token

        kubernetes_sd_configs:
        - role: node

        relabel_configs:
        - action: labelmap
          regex: __meta_kubernetes_node_label_(.+)
        - target_label: __address__
          replacement: kubernetes.default.svc:443
        - source_labels: [__meta_kubernetes_node_name]
          regex: (.+)
          target_label: __metrics_path__
          replacement: /api/v1/nodes/${1}/proxy/metrics/cadvisor
```

## Apply the Changes to the Prometheus Configuration Map
```bash
kubectl apply -f prometheus-config-map.yml
```
## Delete the Prometheus Pod
List the pods to find the name of the Prometheus pod:
```bash
kubectl get pods -n monitoring
```
Delete the Prometheus pod:
```bash
kubectl delete pods <POD_NAME> -n monitoring




```
Open up a new web browser tab, and navigate to the Expression browser. This will be at the public IP of the lab server, on port 8080:`http://<IP>:8080`

Click on Status, and select Target from the dropdown. We should see two targets in there.