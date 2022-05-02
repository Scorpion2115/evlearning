# Building Self-healing Pods with Restart Policies
* Restart Policies

## Restart Policies
Kubernetes can automatically restart containers when they fail.

Restart Policies allows you to customize this behavior by defining when you want a pod's containers to be automatically restarted

### restartPolicy: Always
Containers will `always` be restarted if they stop

This policy apply to application that should always be running

`vi always-pod.yml`
```yml
apiVersion: v1
kind: Pod
metadata:
  name: always-pod
spec:
  restartPolicy: Always
  containers:
  - name: busybox
    image: busybox
    # the container will sleep for 10s and complete
    command: ['sh', '-c', 'sleep 10']
```

You can the container will always restarted even if it complete successfully
```bash
kubectl get po always-pod 
NAME         READY   STATUS    RESTARTS      AGE
always-pod   1/1     Running   2 (24s ago)   51s
```

### restartPolicy: OnFailure 
Restart container under one of the below conditions:
* The container process exits with an error code or 
* The container is determined unhealthy by a liveness probe

`vi onfailure-pod.yml`
```yml
apiVersion: v1
kind: Pod
metadata:
  name: onfailure-pod
spec:
  restartPolicy: OnFailure 
  containers:
   - name: busybox
     image: busybox
     command: ['sh', '-c', 'sleep 10; this is a bad command that will fail your container']
```

You can the container will restarted after a failure, due to the toxic command
```bash
kubectl get po onfailure-pod 
cloud_user@5dad3b3c451c:~/pod-probes$ kubectl get po
NAME            READY   STATUS             RESTARTS      AGE
onfailure-pod   0/1     CrashLoopBackOff   1 (13s ago)   40s


kubectl get po onfailure-pod 
NAME            READY   STATUS    RESTARTS      AGE
onfailure-pod   1/1     Running   2 (21s ago)   48s
```
### restartPolicy: Never 
The pod will never be restarted
`vi never-pod.yml`
```yml
apiVersion: v1
kind: Pod
metadata:
  name: never-pod
spec:
restartPolicy: Never 
containers:
  - name: busybox
    image: busybox
    command: ['sh', '-c', 'sleep 10; this is a bad command that will fail']
```