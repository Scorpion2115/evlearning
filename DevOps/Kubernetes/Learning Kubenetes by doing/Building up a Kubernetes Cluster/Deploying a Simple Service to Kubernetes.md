# Deploying a Simple Service to Kubernetes

## You will need to do the following:
* Create a deployment for the store-products service with four replicas.
* Create a store-products service and verify that you can access it from the busybox testing pod.

## Create a deployment for the store-products service with four replicas.
Log in to the Kube master node. Create the `deployment` with four replicas:
```bash
cat << EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: store-products
  labels:
    app: store-products
spec:
  replicas: 4
  selector:
    matchLabels:
      app: store-products
  template:
    metadata:
      labels:
        app: store-products
    spec:
      containers:
      - name: store-products
        image: linuxacademycontent/store-products:1.0.0
        ports:
        - containerPort: 80
EOF

## verify deployment
kubectl get deployment

## should be
NAME             DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
store-products   4         4         4            4           2m18s

## verify pod
kubectl get pod

## should be
NAME                              READY   STATUS    RESTARTS   AGE
busybox                           1/1     Running   1          125m
store-products-576bb96d6d-gst65   1/1     Running   0          3m25s
store-products-576bb96d6d-jcjlh   1/1     Running   0          3m25s
store-products-576bb96d6d-sz4pt   1/1     Running   0          3m25s
store-products-576bb96d6d-trv4w   1/1     Running   0          3m25s
```

## Create a store-products service and verify that you can access it from the busybox testing pod.
Create a `service` for the store-products pods:
```bash
cat << EOF | kubectl apply -f -
kind: Service
apiVersion: v1
metadata:
  name: store-products
spec:
  selector:
    app: store-products
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
EOF

## verify the service
kubectl get svc

## should be
NAME             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
kubernetes       ClusterIP   10.96.0.1        <none>        443/TCP   128m
store-products   ClusterIP   10.110.198.110   <none>        80/TCP    69s
```

Use kubectl exec to query the store-products service from the busybox testing pod.

```bash
kubectl exec busybox -- curl -s store-products
```