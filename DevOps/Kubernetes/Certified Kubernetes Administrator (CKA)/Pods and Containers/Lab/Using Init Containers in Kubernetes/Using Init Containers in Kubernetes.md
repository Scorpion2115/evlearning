# Using Init Containers in Kubernetes
## Scenario
To build a proof-of-concept showing how a pod can be designed that will delay startup of application containers until the service becomes available

## Create a Sample Pod That Uses an Init Container to Delay Startup
1. Add an init container (at the same level as containers in the file) to delay startup until the shipping-svc service is available:
`vi pod.yml`, 
```yml
spec:
  ...
  initContainers:
  - name: shipping-svc-check
    image: busybox:1.27
    command: ['sh', '-c', 'until nslookup shipping-svc; do echo waiting for shipping-svc; sleep 2; done']
```

2. Verity the pod status. You should see the pod is stuck on the init process, because shipping-svc is not ready yet.
```bash
kubectl get po shipping-web 

# NAME           READY   STATUS     RESTARTS   AGE
# shipping-web   0/1     Init:0/1   0          35s
```

## Test Your Setup by Creating the Service and Verifying the Pod Starts Up
1. Deploy the shipping-svc
```bash
kubectl apply -f shipping-svc.yml
```

2. Verity the pod status. You should see the pod is stuck on the init process, because shipping-svc is not ready yet.
```bash
kubectl get po 


#NAME                   READY   STATUS             RESTARTS         AGE
#shipping-backend       1/1     Running            0                21s
#shipping-web           1/1     Running            0                3m55s
```