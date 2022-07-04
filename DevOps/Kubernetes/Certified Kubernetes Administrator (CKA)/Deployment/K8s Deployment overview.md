# K8s Deployment overview
## What is a deployment
Deployment is a k8s object that defines a desired state for a set of replica pods.

The deployment controller seeks to maintain the desired state by creating, deleting, and replacing pods with new configurations

## Desire State
A deployment's desired state includes
* replica: the number of replica pods the deployment will seek to maintain
* selector: a label selector used to identify the replica pods managed by the deployment
* template: a template pod definition used to create replica pods

## Use Cases
* Easily scale an application up or down by changing the number of replicas
* Perform rolling updates to deploy a new software version
* Rollback ti a previous version

## Demo
`vi my-deployment.yml`
```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
# this is the deployment spec, not a pod spec
spec:
  replicas: 3
  # use the selector to locate which pod are going to be managed by this deployment
  selector:
    # any pods that match the selector will be managed by this deployment
    matchLabels:
      app: nginx
  # pod template
  template:
    metadata:
      # use the same label as above, to make sure the pods that are created by this deployment will be detected by the selector, so that the deployment can manage these pods
      labels:
        app: nginx
    # pod spec    
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```