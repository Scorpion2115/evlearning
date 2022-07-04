# Monitoring Container Health with Probes
* Liveness Probes
* Startup Probes
* Readiness Probes

## Liveness Probes
Allow you to automatically determine whether or not a container application is in a healthy state

By default, k8s will only consider a container to be down, if the container process stops

Liveness probes allow you to customize this detection mechanism and make it more sophisticated

`vi liveness-pod.yml`
```yml
apiVersion: v1
kind: Pod
metadata:
  name: liveness-pod
spec:
  containers:
  - name: busybox
    image: busybox
    command: ['sh', '-c', 'while true; do sleep 3600; done']
    livenessProbe:
        # execute this command every 5s, if succeed, the container is considered as healthy
        exec:
            command:  ["echo", "Hello, world!"]
        initialDelaySeconds: 5
        periodSeconds: 5
```

## Startup Probes
Very similar to liveness probes, but instead of running constantly on a schedule, startup probes run at container startup and stop running once they succeed
`vi startup-pod.yml`
```yml
apiVersion: v1
kind: Pod
metadata:
  name: startup-pod
spec:
  containers:
  - name: nginx
    image: nginx:1.19.1
    startupProbe:
      httpGet:
        path: /
        port: 80
      # allows the startup probe to wait longer
      failureThreshold: 30
      periodSeconds: 10
```

## Readiness Probes
To determine when a container is ready to accept requests

Use readiness probes to prevent user traffic from being sent to pods that are still in the process of starting up.
`vi readiness-pod.yml`
```yml
apiVersion: v1
kind: Pod
metadata:
  name: readiness-pod
spec:
  containers:
  - name: nginx
    image: nginx:1.19.1
    readinessProbe:
      httpGet:
        path: /
        port: 80
      initialDelaySeconds: 5
      periodSeconds: 5
```