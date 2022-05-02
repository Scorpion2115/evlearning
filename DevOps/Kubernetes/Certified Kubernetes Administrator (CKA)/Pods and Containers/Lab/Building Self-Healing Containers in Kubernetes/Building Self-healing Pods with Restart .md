# Building Self-healing Pods with Restart Policies
## Scenario
The application running in the pod has been crashing repeatedly.
You will implement a self-healing solution in k8s to quickly recover whenever the application crashes.

## Issue observation:
Use the busybox pod to make a request to the pod to see if it is working:
```bash
kubectl exec busybox -- curl <beebox-shipping-data_ IP>:8080
```
We will likely get an internal error message.

## Set a Restart Policy to Restart the Container When It Is Down
Open the file `vi beebox-shipping-data.yml`
Set the restartPolicy to Always:
```yml
spec:
  ...
  restartPolicy: Always
  ...
```

## Create a Liveness Probe to Detect When the Application Has Crashed
Add a liveness probe:
```yml
spec:
  containers:
  - ...
    name: shipping-data
    livenessProbe:
      httpGet:
        path: /
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
    ...
```

## Conclusion
Delete and redeploy the pod again. Then use the busybox pod to make a request to the new pod.
```bash
kubectl exec busybox -- curl <beebox-shipping-data_ IP>:8080
```
The internal error is gone, because the pod will get restarted whenever this error happens