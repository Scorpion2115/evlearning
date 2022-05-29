# Practice Exam 10 - Trouble Shooting 
## Determine What Is Wrong with the Broken Node
```bash
kubectl get node -o wide
NAME             STATUS     ROLES                  AGE    VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION    CONTAINER-RUNTIME
acgk8s-control   Ready      control-plane,master   150m   v1.23.0   10.0.1.101    <none>        Ubuntu 20.04.3 LTS   5.11.0-1028-aws   containerd://1.5.5
acgk8s-worker1   Ready      <none>                 149m   v1.23.0   10.0.1.102    <none>        Ubuntu 20.04.3 LTS   5.11.0-1028-aws   containerd://1.5.5
acgk8s-worker2   NotReady   <none>                 149m   v1.23.0   10.0.1.103    <none>        Ubuntu 20.04.3 LTS   5.11.0-1028-aws   containerd://1.5.5

echo acgk8s-worker2 > /k8s/0004/broken-node.txt
```
## Fix the Problem
```bash
kubectl describe node acgk8s-worker2

ssh acgk8s-worker2 

sudo journalctl -u kubelet

sudo systemctl restart kubelet

sudo systemctl status kubelet
```