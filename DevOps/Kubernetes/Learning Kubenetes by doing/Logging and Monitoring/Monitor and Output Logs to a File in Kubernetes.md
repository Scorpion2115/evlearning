# Monitor and Output Logs to a File in Kubernetes

## You will need to do the following:

* Identify the pod that is not running in the cluster.
* Collect the logs from the pod and try to identify the problem.
* Output the logs to a file in order to share that file with your colleagues.

## Identify the pod that is not running in the cluster
```bash
kubectl get pods --all-namespaces
```

## Collect the logs from the pod and try to identify the problem.
```bash
kubectl logs `pod-name` -n `namespace`
```

## Output the logs to a file in order to share that file with your colleagues.
```bash
kubectl logs `pod-name` -n `namespace` > my-pod-log.log
```
