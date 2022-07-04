# Managing Container Resources
* Resource Request
* Resource Limits

## Resource Requests
Allows you to define an amount of resources (CPU or Memory) you expect a container to use.
* CPU is measured by CPU units, which are 1/1000 of one CPU
* Memory is measured by bytes

The Kubernetes scheduler will use resources requests to avoid scheduling pods on nodes that do not have enough available resources

Containers are allowed to use more (or less) than the requested resources. Resource requests only affect `scheduling`

## Resource Limits
Provide a way for you to limit the amount of resources your container can use

The container runtime is responsible for enforcing these limits

```yml
apiVersion: v1
kind: Pod
metadata:
  name: resource-pod
spec:
containers:
- name: busybox
    image: busybox
    command: ['sh', '-c', 'while true; do sleep 3600; done']
    resources:
      requests:
        cpu: "250m"
        memory: "128Mi"
      limits:
        cpu: "500m"
        memory: "256Mi"
```

