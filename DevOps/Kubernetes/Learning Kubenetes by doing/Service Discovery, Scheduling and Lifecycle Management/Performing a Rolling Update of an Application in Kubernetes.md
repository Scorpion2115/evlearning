# Performing a Rolling Update of an Application in Kubernetes

You will need:
* Create and roll out a deployment, and verify the deployment was successful.
* Scale up your application to create high availability.
* Create a service from your deployment, so users can access your application.
* Perform a rolling update to version 2 of the application.
* Verify the app is now at version 2 and there was no downtime to end users.

## Create and roll out a deployment, and verify the deployment was successful.
```bash
nano k8s-deployment.yml
```

```yml
apiVersion: apps/v1
 kind: Deployment
 metadata:
   name: kubeserve
 spec:
   replicas: 3
   selector:
     matchLabels:
       app: kubeserve
   template:
     metadata:
       name: kubeserve
       labels:
         app: kubeserve
     spec:
       containers:
       - image: linuxacademycontent/kubeserve:v1
         name: app
```
```bash
kubectl apply -f k8s-deployment.yml

kubectl rollout status deployments kubeserve

kubectl describe deployment kubeserve
#
...
app:
    Image:        linuxacademycontent/kubeserve:v1
...    
#
```
## Scale up your application to create high availability.
```bash
kubectl scale deployment kubeserve --replicas=5
```
## Create a service from your deployment, so users can access your application.
```bash
kubectl expose deployment kubeserve --port 80 --target-port 80 --type NodePort

kubectl get services
#
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP        18m
kubeserve    NodePort    10.109.64.47   <none>        80:32143/TCP   8s
```
# Perform a rolling update to version 2 of the application.
Run this while loop on the master node from a new terminal
```bash
while true; do curl curl http://10.109.64.47; done
# This is v1 pod kubeserve-968646c97-5bw4j

# Use this command to perform the update (while the curl loop is running):
kubectl set image deployments/kubeserve app=linuxacademycontent/kubeserve:v2 --v 6


# This is v2 pod kubeserve-5589d5cb58-x2q87
```
Verify the app is now at version 2 and there was no downtime to end users.
```bash
kubectl rollout history deployment kubeserve

# 
deployment.extensions/kubeserve
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```

