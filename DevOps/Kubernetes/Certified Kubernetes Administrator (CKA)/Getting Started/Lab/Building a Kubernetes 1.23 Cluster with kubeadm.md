# Building a Kubernetes Cluster with Kubeadm

## Install Packages

1. Log into the Control Plane Node (Note: The following steps must be performed on all three nodes.).

2. Create configuration file for containerd:
```bash
cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF
```

3. Load modules:
```bash
sudo modprobe overlay
sudo modprobe br_netfilter
```

4. Set system configurations for Kubernetes networking:
```bash
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF
```

5. Apply new settings:
```bash
sudo sysctl --system
```

6. Install containerd:
```bash
sudo apt-get update && sudo apt-get install -y containerd
```

7. Create default configuration file for containerd:
```bash
sudo mkdir -p /etc/containerd
```

8. Generate default containerd configuration and save to the newly created default file:
```bash
sudo containerd config default | sudo tee /etc/containerd/config.toml
```

9. Restart containerd to ensure new configuration file usage:
```bash
sudo systemctl restart containerd
```

10. Verify that containerd is running.
```bash
sudo systemctl status containerd
```

11. Disable swap:
```bash
sudo swapoff -a
```

12. Disable swap on startup in /etc/fstab:
```bash
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```

13.Install dependency packages:
```bash
sudo apt-get update && sudo apt-get install -y apt-transport-https curl
```

14. Download and add GPG key:
```bash
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
```

15. Add Kubernetes to repository list:
```bash
cat <<EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
```

16. Update package listings:
```bash
sudo apt-get update
```

17. Install Kubernetes packages (Note: If you get a dpkg lock message, just wait a minute or two before trying the command again):
```bash
sudo apt-get install -y kubelet=1.23.0-00 kubeadm=1.23.0-00 kubectl=1.23.0-00
```

18. Turn off automatic updates:
```bash
sudo apt-mark hold kubelet kubeadm kubectl
```
19. Log into both Worker Nodes to perform previous steps.

## Initialize the Cluster
1. Initialize the Kubernetes cluster on the control plane node using kubeadm (Note: This is only performed on the Control Plane Node):
```bash
sudo kubeadm init --pod-network-cidr 192.168.0.0/16 --kubernetes-version 1.23.0
```

2. Set kubectl access:
```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

3. Test access to cluster:
```bash
kubectl get nodes
```

## Install the Calico Network Add-On
1. On the Control Plane Node, install Calico Networking:
```bash
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```

2. Check status of the control plane node:
```bash
kubectl get nodes
```

## Join the Worker Nodes to the Cluster
In the Control Plane Node, create the token and copy the kubeadm join command (NOTE:The join command can also be found in the output from kubeadm init command):
```bash
kubeadm token create --print-join-command

## kubeadm join 172.31.6.124:6443 --token h7idum.3x8aomq0i8ltgiix --discovery-token-ca-cert-hash sha256:839526bd7dade7ed1fd177aa2be9abd1666bde57e1dd3bb51ec908feda662207 
```

2. In both Worker Nodes, paste the kubeadm join command to join the cluster. Use sudo to run it as root:
```bash
sudo kubeadm join ...
```

3. In the Control Plane Node, view cluster status (Note: You may have to wait a few moments to allow all nodes to become ready):
```bash
kubectl get nodes
```
