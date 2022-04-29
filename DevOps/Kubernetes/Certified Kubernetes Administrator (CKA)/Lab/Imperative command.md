# Imperative command
1. Create a deployment imperatively.
```bash
kubectl create deployment my-deployment --image=nginx
```

2. Do a dry run to quickly obtain a sample yml file you can manipulate
```bash
 kubectl create deployment my-deployment --image=nginx --dry-run -o yaml

# save it
 kubectl create deployment my-deployment --image=nginx --dry-run -o yaml > deployment.yml
 ```

 ```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: my-deployment
  name: my-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-deployment
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: my-deployment
    spec:
      containers:
      - image: nginx
        name: nginx
        resources: {}
status: {}
```