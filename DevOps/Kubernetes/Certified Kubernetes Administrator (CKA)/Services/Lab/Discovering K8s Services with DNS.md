# Discovering K8s Services with DNS
## Get the IP address of the ClusterIP Service.
```bash
kubectl get service svc-clusterip

NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
svc-clusterip   ClusterIP   10.109.148.12   <none>        80/TCP    3d9h
```

## Perform a DNS lookup on the service from the busybox Pod.
```bash
kubectl exec pod-svc-test -- nslookup 10.109.148.12


Server:    10.96.0.10
Address 1: 10.96.0.10 kube-dns.kube-system.svc.cluster.local

Name:      10.109.148.12
Address 1: 10.109.148.12 svc-clusterip.default.svc.cluster.local
```

## Make a request from busybox 
1. Using the services's IP address
```bash
kubectl exec pod-svc-test -- curl 10.109.148.12
```

2. Using the DNS name
```bash
# full DNS name
kubectl exec pod-svc-test -- curl svc-clusterip.default.svc.cluster.local

# short DNS name
kubectl exec pod-svc-test -- curl svc-clusterip
```
