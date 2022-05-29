# Exploring Kubernetes Persistent Volume
1. Create a StorageClass that supports volume expansion.
`kubectl apply -f localdisk-sc.yml`

2. Create PV and the PV's status will be available
```bash
kubectl apply -f my-pv.yml

kubectl get pv -n demo

NAME    CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
my-pv   1Gi        RWO            Recycle          Available           localdisk               5s
```

3. Create a PersistentVolumeClaim that will bind to the PersistentVolume.
```bash
kubectl apply -f my-pvc.yml

kubectl get pv -n demo

NAME    CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM         STORAGECLASS   REASON   AGE
my-pv   1Gi        RWO            Recycle          Bound    demo/my-pvc   localdisk               89s
```

4. Create a Pod that uses the PersistentVolumeClaim
`kubectl apply -f pv-pod.yml`

5. Find out which node the pod is deployed on, and verify the content
```bash
cat /var/output/notes.txt 

# Writing to the pv
```

6. Expand the PersistentVolumeClaim and record the process.
`kubectl edit pvc my-pvc --record`

7. Delete the pod and pvc, then the pv will be available for another user
```bash
kubectl delete  -f pv-pod.yml

kubectl delete -f my-pvc.yml


kubectl get pv -n demo
NAME    CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
my-pv   1Gi        RWO            Recycle          Available           localdisk               4m53s
```