# Application Monitoring


## Client Library
![img](./img/k8s_prometheus_client_libs.jpg)
The client library sits in the application. 

The client libaray go and gather the metrics on your applcation and format them to what prometheus can understand

## Collecting Metrics from Applications
1. Deploy a sample application written by Node.js

2. Generate some traffic to the application's URL
```bash
http://10.223.90.111:30081/

# go to swagger stats ui
http://10.223.90.111:30081/swagger-stats/ui

# browse swagger stats metrics which can be pasted in prometheus
http://10.223.90.111:30081/swagger-stats/metrics
```

## Reference
[CLIENT LIBRARIES](https://prometheus.io/docs/instrumenting/clientlibs/)