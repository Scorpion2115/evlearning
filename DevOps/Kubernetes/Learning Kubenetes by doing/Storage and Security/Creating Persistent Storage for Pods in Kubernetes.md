# Creating Persistent Storage for Pods in Kubernetes

![img](img/persistent_volume.png)

## You will need to do the following:
* Create a PersistentVolume.
* Create a PersistentVolumeClaim.
* Create the redispod image, with a mounted volume to mount path `/data`
* Connect to the container and write some data.
* Delete `redispod` and create a new pod named `redispod2`.
* Verify the volume has persistent data.

## Create a PersistentVolume.
Use the following YAML spec for the PersistentVolume:
```bash
nano redis-pv.yaml

apiVersion: v1
kind: PersistentVolume
metadata:
  name: redis-pv
spec:
  storageClassName: ""
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"

# Then, create the PersistentVolume:
kubectl apply -f redis-pv.yaml
```

## Create a PersistentVolumeClaim.
Use the following YAML spec for the PersistentVolumeClaim:
```bash
nano redis-pvc.yaml

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redisdb-pvc
spec:
  storageClassName: ""
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi

# Then, create the PersistentVolumeClaim:
kubectl apply -f redis-pvc.yaml
```

## Create the redispod image, with a mounted volume to mount path `/data`
Use the following YAML spec for the pod named:
```bash
nano redispod.yaml

apiVersion: v1
kind: Pod
metadata:
  name: redispod
spec:
  containers:
  - image: redis
    name: redisdb
    volumeMounts:
    - name: redis-data
      mountPath: /data
    ports:
    - containerPort: 6379
      protocol: TCP
  volumes:
  - name: redis-data
    persistentVolumeClaim:
      claimName: redisdb-pvc

# Then, create the pod:
kubectl apply -f redispod.yaml

# Verify the pod was created:
kubectl get pods
```

## Connect to the container and write some data.
Connect to the container and run the redis-cli:
```bash
kubectl exec -it redispod redis-cli
```

Set the key space server:name and value "redis server":
```bash
SET server:name "redis server"
```

Run the GET command to verify the value was set:
```bash
GET server:name
```

## Delete `redispod` and create a new pod named `redispod2`.
Delete the existing redispod:
```bash
kubectl delete pod redispod
```
Open the file redispod.yaml and change line 4 from name: redispod to `name: redispod2`

Create a new pod named redispod2:
```bash
kubectl apply -f redispod.yaml
```

## Verify the volume has persistent data.
```bash
kubectl exec -it redispod redis-cli

GET server:name
```
