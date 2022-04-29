# Installing and Testing the Components of a Kubernetes Cluster

## You will need to do the following:
* Install a three node Kubernetes cluster
* Create a deployment that uses the nginx image
* Expose only one pod on port 8081
* Verify the NGINX version on the pod
* Create a service for the deployment on port 80


## Install a three node Kubernetes cluster
### 1. Get the Docker gpg, and add it to your repository.

In all three terminals, run the following command:
```bash
# Get the Docker gpg
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Then add it to your repository:
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

### 2. Get the Kubernetes gpg key, and add it to your repository.

In all three terminals, run the following command:
```bash
# get the Kubernetes gpg key
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -

# Then add it to your repository:
cat << EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF

# Update the packages:
sudo apt update
```

### 3. Install Docker, kubelet, kubeadm, and kubectl.

In all three terminals, run the following command:
```bash
sudo apt install -y docker-ce=5:19.03.10~3-0~ubuntu-focal kubelet=1.18.5-00 kubeadm=1.18.5-00 kubectl=1.18.5-00
```

### 4. Initialize the Kubernetes cluster.
In the Controller server terminal, run the following command to initialize the cluster using kubeadm:
```bash
sudo kubeadm init --pod-network-cidr=10.244.0.0/16


# Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 10.0.1.101:6443 --token q9kzko.wxr7mb2tjpjo3ner \
    --discovery-token-ca-cert-hash sha256:1987fccd44021384c99842e66fbabccc87952f05bb2adac98d253dda27e7fd16
```

### 5. ??? Set up local kubeconfig. ???

In the Controller server terminal, run the following commands to set up local kubeconfig:
```bash
sudo mkdir -p $HOME/.kube

sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### 6. Apply the flannel CNI plugin as a network overlay.

In the Controller server terminal, run the following command to apply flannel:
```bash
kubectl apply -f https://docs.projectcalico.org/v3.14/manifests/calico.yaml
```
### 7. Join the worker nodes to the cluster

You can now join any number of machines by running the following on each node as root:

To join worker nodes to the cluster, we need to run that command, as root 

```bash
sudo kubeadm join 10.0.1.101:6443 --token q9kzko.wxr7mb2tjpjo3ner \
    --discovery-token-ca-cert-hash sha256:1987fccd44021384c99842e66fbabccc87952f05bb2adac98d253dda27e7fd16
```


## Create a deployment that uses the nginx image
Run a deployment that includes at least one pod, and verify it was successful.

In the Controller server terminal, run the following command to run a deployment of ngnix:
```bash
kubectl create deployment nginx --image=nginx

# Verify its success:
kubectl get deployments

# Verify the pod is running and available.
kubectl get pods
```

## Expose only one pod on port 8081

Use port forwarding to extend port 80 to 8081, and verify access to the pod directly.

In the Controller server terminal, run the following command to forward the container port 80 to 8081:
```bash
kubectl port-forward <pod_name> 8081:80
```

Open a new terminal session and log in to the Controller server. Then, run this command to verify we can access this container directly:
```bash
curl -I http://127.0.0.1:8081
# We should see a status of HTTP/1.1 200 OK
```

## Verify the NGINX version on the pod
```bash
kubectl exec -it <pod_name> -- nginx -v
```

## Create a service for the deployment on port 80

In the original Controller server terminal, run the following command to create a NodePort service:
```bash
kubectl expose deployment nginx --port 80 --type NodePort

# View the service:
kubectl get services

# You will find the ports
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP        17m
nginx        NodePort    10.100.224.21   <none>        80:30508/TCP   7s

# Get the node the pod resides on.
kubectl get pod -o wide

# You will see which node is expoesed
NAME                    READY   STATUS    RESTARTS   AGE     IP             NODE            NOMINATED NODE   READINESS GATES
nginx-f89759699-6mwts   1/1     Running   0          8m56s   10.244.111.1   ip-10-0-1-103   <none>           <none>

# Verify the connectivity
curl -I YOUR_NODE:YOUR_PORT
curl -I ip-10-0-1-103:30508
# We should see a status of HTTP/1.1 200 OK
```
