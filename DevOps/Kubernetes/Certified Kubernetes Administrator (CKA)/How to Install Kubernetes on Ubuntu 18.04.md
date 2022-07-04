# How to Install Kubernetes on Ubuntu 18.04

## Table of Contents
1. Install Docker: 
   * Update the apt repository and install docker
   * Start and Enable Docker

2. Setup NTP
  * Setup NTP on each node

3. Install Kubernetes
   * Update the apt repository and install docker
   * Add Software Repositories
   * Kubernetes Installation Tools
   * Disable the swap memory on each server
   * Verify Kubernetes Installation Tools

4. Kubernetes Deployment
   * Initialize Kubernetes on Master Node
   * Deploy Pod Network to Cluster
   * Join Worker Node to Cluster
   
5. Teardown the cluster   
<br></br>

## Overview
![img](img/architecture.png)
<br></br>

## 1: Install Docker (Apply to all nodes)
Kubernetes requires an existing Docker installation.
### 1.1:  Update the apt repository and install docker:
```bash
sudo apt-get update

sudo apt-get install docker.io -y
```

### 1.2: Start and Enable Docker
```bash
# this command is to get docker up and running when the system is up
sudo systemctl enable docker

sudo systemctl status docker

sudo systemctl start docker
```
<br></br>


## 2. Setup NTP (Apply to all nodes)
You will need setup NTP on each nodes, otherwise, you might got this error when join nodes to the cluster
`join x509: certificate has expired or is not yet valid`

```bash
sudo apt install ntp

# Connect ntp to TPG server
sudo vim /etc/ntp.conf
#pool 0.ubuntu.pool.ntp.org iburst
#pool 1.ubuntu.pool.ntp.org iburst
#pool 2.ubuntu.pool.ntp.org iburst
#pool 3.ubuntu.pool.ntp.org iburst
pool 203.12.160.2 iburst
pool 203.26.24.6 iburst

sudo service ntp restart

# to verify
sudo ntpdate 203.12.160.2
```



## 3. Install Kubernetes (Apply to all nodes)
### 3.1: Add Kubernetes Signing Key
Since you are downloading Kubernetes from a non-standard repository, it is essential to ensure that the software is authentic. This is done by adding a signing key.

Enter the following to add a signing key. Repeat for each server node
```bash
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add


# If you get an error that <strong>curl</strong> is not installed, install it with:
sudo apt-get install curl
```

### 3.2: Add Software Repositories
Kubernetes is not included in the default repositories. To add them, enter the following. Repeat for each server node
```bash
sudo apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"
```

### 3.3: Kubernetes Installation Tools
* `Kubeadm` (Kubernetes Admin) is a tool that helps initialize a cluster. 
* `Kubelet` is the work package, which runs on every node and starts containers. The tool gives you command-line access to clusters.

Install Kubernetes tools with the command:

```bash
sudo apt-get install kubeadm kubelet kubectl -y
sudo apt-mark hold kubeadm kubelet kubectl
kubeadm version
```
### 3.4: Disable the swap memory
```bash
sudo swapoff -a

# to verify
free -h
```

### 3.5: Verify Kubernetes Installation Tools
verify the status of `kubelet`
```bash
sudo systemctl status kubelet
```

In case the kubelete service is failed, the problem was caused by the cgroup driver. Kubernetes cgroup driver was set to systems but docker was set to systemd. To fix is issue, created `/etc/docker/daemon.json` and added below:
```json
{
    "exec-opts": ["native.cgroupdriver=systemd"]
}
```
Then run 
```bash
 sudo systemctl daemon-reload
 sudo systemctl restart docker
 sudo systemctl restart kubelet
```
<br></br>

## 4: Kubernetes Deployment
### 4.1: Initialize Kubernetes on Master Node
Switch to the `master server node`, and enter the following:

```bash
sudo kubeadm init --pod-network-cidr=192.168.0.0/16
```

Next, create a directory for the cluster in the master node:
```bash
mkdir -p $HOME/.kube

sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### 4.2: Deploy Pod Network to Cluster on Master Node
A Pod Network is a way to allow communication between different nodes in the cluster.

**Option A** - Calico
On the Control Plane Node, install Calico Networking:
```bash
wget https://docs.projectcalico.org/manifests/calico.yaml
```

Modify the calico.yaml by searching for autodetect and add following piece
```yml
 # Auto-detect the BGP IP address.
 - name: IP
    value: "autodetect"
 - name: IP_AUTODETECTION_METHOD
    value: "interface=ens*"
```
Install calico from local
```bash
kubectl apply -f calico.yaml

# Check status of the control plane node:
kubectl get nodes
kubectl 
```

**Option A-Archived** - Calico
On the Control Plane Node, install Calico Networking:
```bash
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml

# Check status of the control plane node:
kubectl get nodes
kubectl 
```

**Option B** - Flannel
On the Control Plane Node, install Flannel Networking:
```bash
sudo kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

# Verify that everything is running and communicating:
kubectl get nodes
kubectl get pods --all-namespaces
```

### 4.3: Join Worker Node to Cluster (Apply to worker nodes)
```bash
# generate token
sudo kubeadm token create --print-join-command

## Output looks like this:
## kubeadm join 10.224.44.97:6443 --token jhanmr.sp7a0ves1jnimibp --discovery-token-ca-cert-hash sha256:7eb8c34e849f155c1b53ff4df4d8b75004ebd76aac645afa25fa2fb896205e73


# run the generated token on the each worker nodes
# add --v=2 to view the steps
sudo kubeadm join ... --v=2

# verify
kubectl get nodes
```
<br></br>

## 5. Teardown the cluster
```bash
sudo kubeadm reset
sudo apt-get purge kubeadm kubectl kubelet kubernetes-cni kube*   
sudo apt-get autoremove  
sudo rm -rf ~/.kube
```

## Reference
* [How to Install Kubernetes on Ubuntu 18.04](https://phoenixnap.com/kb/install-kubernetes-on-ubuntu)
* [kubeadm init shows kubelet isn't running or healthy](https://stackoverflow.com/questions/52119985/kubeadm-init-shows-kubelet-isnt-running-or-healthy/68722458#comment124201046_68722458)
* [How to completely uninstall kubernetes](https://stackoverflow.com/questions/44698283/how-to-completely-uninstall-kubernetes/49253264#49253264)
* [calico/node is not ready: BIRD is not ready: BGP not established](https://www.unixcloudfusion.in/2022/02/solved-caliconode-is-not-ready-bird-is.html)
<br></br>