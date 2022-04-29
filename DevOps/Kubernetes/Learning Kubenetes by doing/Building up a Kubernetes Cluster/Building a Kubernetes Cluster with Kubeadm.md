# Building a Kubernetes Cluster with Kubeadm

## You will need to do the following:

* Install Docker on all three nodes.
* Install Kubeadm, Kubelet, and Kubectl on all three nodes.
* Bootstrap the cluster on the Kube master node.
* Join the two Kube worker nodes to the cluster.
* Set up cluster networking with flannel.
![img](cluster.png)

## Install Docker on all three nodes.
Do the following on all three nodes:
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update

## specify a docker version
sudo apt-get install -y docker-ce=18.06.1~ce~3-0~ubuntu

## prevent docker from automatically upgrade.
sudo apt-mark hold docker-ce
```

Verify that Docker is up and running with:
```sudo systemctl status docker```
Make sure the Docker service status is active (running)!

## Install Kubeadm, Kubelet, and Kubectl on all three nodes.
Install the Kubernetes components by running this on all three nodes:
```bash
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
cat << EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
sudo apt-get update
sudo apt-get install -y kubelet=1.14.5-00 kubeadm=1.14.5-00 kubectl=1.14.5-00
sudo apt-mark hold kubelet kubeadm kubectl
```

## Bootstrap the cluster on the Kube master node.
1. On the Kube master node, do this:
```bash
sudo kubeadm init --pod-network-cidr=10.244.0.0/16


## Take note that the kubeadm init command printed a long kubeadm join command to the screen. You will need that kubeadm join command in the next step!
kubeadm join 10.0.1.101:6443 --token 42luse.erwbjnrppbvdy7lv \
    --discovery-token-ca-cert-hash sha256:94f6f7c751fa470bd9455de1d57f9e809ca14efacffdbefc54b571e3f7675692

```

2. When it is done, set up the local kubeconfig:
```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```


3. Run the following commmand on the Kube master node to verify it is up and running:
```bash
kubectl version
```
This command should return both a Client Version and a Server Version.

## Join the two Kube worker nodes to the cluster.
Copy the kubeadm join command that was printed by the kubeadm init command earlier, with the token and hash. Run this command on both worker nodes
```bash
sudo kubeadm join 10.0.1.101:6443 --token 42luse.erwbjnrppbvdy7lv \
    --discovery-token-ca-cert-hash sha256:94f6f7c751fa470bd9455de1d57f9e809ca14efacffdbefc54b571e3f7675692
```
Now, on the Kube master node, make sure your nodes joined the cluster successfully:
```bash
kubectl get nodes

## verify
NAME            STATUS     ROLES    AGE   VERSION
ip-10-0-1-101   NotReady   master   30s   v1.14.5
ip-10-0-1-102   NotReady   &lt;none>   8s    v1.14.5
ip-10-0-1-103   NotReady   &lt;none>   5s    v1.14.5
```

## Set up cluster networking with flannel.
1. Turn on iptables bridge calls on all three nodes:
```bash
echo "net.bridge.bridge-nf-call-iptables=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

2. Next, run this only on the Kube master node:
```bash
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/bc79dd1505b0c8681ece4de4c0d86c5cd2643275/Documentation/kube-flannel.yml
```

Now flannel is installed! Make sure it is working by checking the node status again:
```bash
kubectl get nodes

## verify
NAME            STATUS   ROLES    AGE     VERSION
ip-10-0-1-101   Ready    master   11m     v1.14.5
ip-10-0-1-102   Ready    <none>   4m36s   v1.14.5
ip-10-0-1-103   Ready    <none>   4m41s   v1.14.5
```