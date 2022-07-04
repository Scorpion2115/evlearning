# Using K8s Services


## Preparation
1. Create a sample deployment
`kubectl apply -f deployment-svc-example.yml`

## Test the ClusterIP Service
1. Create a ClusterIP service
`kubectl apply -f svc-clusterip.yml`

2. View the service endpoint
```bash
kubectl get endpoints svc-clusterip 
NAME            ENDPOINTS                                              AGE
svc-clusterip   192.168.102.54:80,192.168.16.127:80,192.168.16.65:80   7m59s


kubectl get po -o wide|grep deployment-svc-example
deployment-svc-example-7565bb8984-7gvsg   1/1     Running            0                 10m     192.168.16.127   5dad3b3c452c.mylabserver.com   <none>           <none>
deployment-svc-example-7565bb8984-p9s7w   1/1     Running            0                 10m     192.168.102.54   5dad3b3c453c.mylabserver.com   <none>           <none>
deployment-svc-example-7565bb8984-qlzlf   1/1     Running            0                 10m     192.168.16.65    5dad3b3c452c.mylabserver.com   <none>           <none>
```
3. Since ClusterIP expose applications `inside` the cluster network. In order to test this, we need test from inside of the cluster network. So we create a testing pod inside the cluster network that will be communicating with our service endpoint
`kubectl apply -f pod-svc-test.yml`

4. Run a command within the busybox Pod to make a request to the service.
```bash 
kubectl exec pod-svc-test -- curl svc-clusterip:80
```

## Test the NodeIP Service
1. Create a NodeIP service
`kubectl apply -f svc-nodeport.yml`

2. You should see the Nginx welcome page via this curl
```bash
curl localhost:30080
```