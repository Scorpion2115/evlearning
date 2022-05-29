# Using Network Policies
## Preparation
1. Create a namespace
```bash
kubectl create ns np-test`
```

2. Add a label to the Namespace
```bash
kubectl label ns np-test team=np-test
```
3. Create a web server pod
```bash
kubectl apply -f np-server-nginx.yml
```

4. Create a client pod
```bash
kubectl apply -f np-client-busybox.yml
```

5. Get the IP address of the server Pod and save it to an environment variable.
```bash
kubectl get pods -n np-test -o wide

NAME                READY   STATUS    RESTARTS   AGE   IP               NODE                           NOMINATED NODE   READINESS GATES
np-client-busybox   1/1     Running   0          14s   192.168.16.118   5dad3b3c452c.mylabserver.com   <none>           <none>
np-server-nginx     1/1     Running   0          49s   192.168.102.45   5dad3b3c453c.mylabserver.com   <none>           <none>


SIP=<np-server-nginx >
```

6. Now the client pod can reach the server pod via its ip address
```bash
kubectl exec -n np-test np-client-busybox -- curl $SIP
```

## Apply network policy
1. Create a NetworkPolicy to deny all traffic
```bash
kubectl apply -f networkpolicy-denyall.yml
```

2. Now the communications between client pod and the server pod are blocked
```bash
kubectl exec -n np-test np-client-busybox -- curl $SIP
```

3. Create a NetworkPolicy to explicitly allow incoming traffic
```bash
kubectl apply -f networkpolicy-allow-incoming.yml 
```

4. Now the client pod can reach the server pod via its ip address again
```bash
kubectl exec -n np-test np-client-busybox -- curl $SIP
```