# Checking cluster and node logs
## Service Logs
You can check the logs for k8s-related services on each node using `journalctl`
```bash
sudo journalctl -u kubelet

sudo journalctl -u docker
```

## Cluster Component Logs
The k8s cluster components have log output redirected to `/var/log`
```bash
/var/log/kube-apiserver.log

/var/log/kube-scheduler.log

/var/log/kube-controller-manager.log

kubectl logs -n <namespace> <pod-name>
```