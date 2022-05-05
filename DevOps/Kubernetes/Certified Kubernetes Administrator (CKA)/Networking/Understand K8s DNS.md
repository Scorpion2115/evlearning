# Understand K8s DNS
## DNS in k8s
The k8s virtual network uses a DNS (Domain Name System) to allow pods to locate other pods and services using domain names instead of IP addresses
```bash
kubectl get po -n kube-system

NAME                                                   READY   STATUS    RESTARTS      AGE
coredns-64897985d-8thrj                                1/1     Running   8 (14m ago)   6d21h
coredns-64897985d-lmx6b                                1/1     Running   8 (14m ago)   6d21h
```
## Pod Domain Name
All pods in the k8s cluster are automatically given a domain name of the following form:
`<pod-id-address>.<namespaces-name>.pod.cluster.local`

## Demo
1. Create a dns test pods `kubectl apply -f dnstest-pods.yml`
```yml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-dnstest
spec:
  containers:
  - name: busybox
    image: radial/busyboxplus:curl
    command: ['sh', '-c', 'while true; do sleep 3600; done'] 
---
apiVersion: v1
kind: Pod
metadata:
  name: nginx-dnstest
spec:
  containers:
  - name: nginx
    image: nginx:1.19.2
    ports:
    - containerPort: 80
```

2. Get ip address of both dns test pods 
```bash
kubectl get po -o wide | grep dnstest

busybox-dnstest        1/1     Running            0                 2m55s   192.168.102.32   5dad3b3c453c.mylabserver.com   <none>           <none>
nginx-dnstest          1/1     Running            0                 2m55s   192.168.16.103   5dad3b3c452c.mylabserver.com   <none>           <none>
```

3. Verify the DNS
* Reach the `ngnix-dnstest` pod from the `busybox-dnstest` pod over the cluster network using its `ip address`
```bash
kubectl exec busybox-dnstest -- curl 192.168.16.103
```

* Use the `busybox-dnstest` Pod to look up the DNS record for the `nginx-dnstest` Pod.
```bash
kubectl exec busybox-dnstest -- nslookup 192-168-16-103.default.pod.cluster.local

Server:    10.96.0.10
Address 1: 10.96.0.10 kube-dns.kube-system.svc.cluster.local

Name:      192-168-16-103.default.pod.cluster.local
Address 1: 192.168.16.103 ip-192-168-16-103.ap-southeast-2.compute.internal
```

* Reach the `ngnix-dnstest` pod from the `busybox-dnstest` pod over the cluster network using its `domain name`
```bash
kubectl exec busybox-dnstest -- curl 192-168-16-103.default.pod.cluster.local
```