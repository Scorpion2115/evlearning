# Scheduling Pods with Taints and Tolerations in Kubernetes

You will need:
* Taint one of the worker nodes to identify the prod environment.
* Create the YAML spec for a pod that will be scheduled to the dev environment.
* Create the YAML spec for a pod that will be scheduled to the prod environment.
* Verify each pod has been scheduled successfully to each environment.

## Background
* `Taint`: Allow a node to repel a set of pods

* `Tolerations`: applu to pods, and allow (but do not require) the pods to schedule onto nodes with mating taints.

* Taint and tolerations work together to ensure that pods are not scheduled onto inappropriate nodes.


## Taint one of the worker nodes as repel node, to identify the prod environment.
Use the following command to taint the node:
```bash
kubectl taint node ip-10-0-1-103  node-type=prod:NoSchedule

kubectl describe node ip-10-0-1-103
```

## Create the YAML spec for a pod that will be scheduled to the dev environment.
```bash
nano dev-pod.yml
```

```yml
apiVersion: v1
kind: Pod
metadata:
  name: dev-pod
  labels:
    app: busybox
spec:
  containers:
  - name: dev
    image: busybox
    command: ['sh', '-c', 'echo Hello Kubernetes! && sleep 3600']
```
```bash
kubectl create -f dev-pod.yml
```

## Create the YAML spec for a pod that will be scheduled to the prod environment.
```bash
vim prod-deployment.yml
```

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prod
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prod
  template:
    metadata:
      labels:
        app: prod
    spec:
      containers:
      - args:
        - sleep
        - "3600"
        image: busybox
        name: main
      tolerations:
      - key: node-type
        operator: Equal
        value: prod
        effect: NoSchedule
```
```bash
kubectl create -f prod-deployment.yml
```

## Verify each pod has been scheduled successfully to each environment.
```bash
kubectl scale deployment/prod --replicas=3

kubectl get pods -o wide

# Two new pods are deployed on  ip-10-0-1-103 
NAME                    READY   STATUS    RESTARTS   AGE     IP           NODE            NOMINATED NODE   READINESS GATES
dev-pod                 1/1     Running   0          7m44s   10.244.2.2   ip-10-0-1-102   <none>           <none>
prod-7654d444bc-77gwp   1/1     Running   0          2m4s    10.244.1.2   ip-10-0-1-103   <none>           <none>
prod-7654d444bc-t2989   1/1     Running   0          4s      10.244.1.3   ip-10-0-1-103   <none>           <none>
prod-7654d444bc-w4tzt   1/1     Running   0          4s      10.244.2.3   ip-10-0-1-102   <none>           <none>

```

