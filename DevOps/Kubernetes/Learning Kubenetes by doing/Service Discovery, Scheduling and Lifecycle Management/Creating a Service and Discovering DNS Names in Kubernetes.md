# Creating a Service and Discovering DNS Names in Kubernetes

You will need:
* Create an nginx deployment using the latest nginx image.
* Create a service from the nginx deployment created in the previous objective.
* Create a pod that will allow you to perform the DNS query.

## Create an nginx deployment using the latest nginx image.
```bash
kubectl run nginx --image=nginx

kubectl get deployments
```

## Create a service from the nginx deployment created in the previous objective.
```bash
kubectl expose deployment nginx --port 80 --type NodePort

kubectl get services
```

## Create a pod that will allow you to perform the DNS query.
```bash
nano busybox.yml
```
```yml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
spec:
  containers:
  - image: busybox:1.28.4
    command:
      - sleep
      - "3600"
    name: busybox
  restartPolicy: Always
```
```bash
kubectl create -f busybox.yaml

kubectl get pods
```

## Perform the DNS query to the service created in an earlier objective.
```bash
kubectl exec busybox -- nslookup nginx

## Record the DNS name
Name:      nginx
Address 1: 10.104.186.224 nginx.default.svc.cluster.local
```
