# Passing Configuration Data to a Kubernetes Container

## Scenario
There is a Nginx web server, which is used as part of a secure backend application, and the company would like it to be configured to use HTTP basic authentication.
This will require:
1. An `htpasswd` file 
2. A custom Nginx config file. 
In order to deploy this Nginx server to the cluster with good configuration practices, you will need to load the custom Nginx configuration from a ConfigMap  and use a Secret to store the `htpasswd` data.

## Solution
### Generate an `htpasswd` File and Store It as a Secret
1. Generate an `htpasswd` File
```bash
htpasswd -c .htpasswd user

#helloworld
```

2. View the file's contents:
```bash
ls -la
#-rw-rw-r--  1 cloud_user cloud_user   43 Apr 28 13:09 .htpasswd

cloud_user@5dad3b3c451c:~/pod-container$ cat .htpasswd
#user:$apr1$OYnDWBFo$vraOmsc4fPiIuAMFt.ewz0
```

3. Create a Secret contains the `htpasswd` data
```bash
kubectl create secret generic nginx-htpasswd --from-file .htpasswd
```

4. Delete the .htpasswd file:
```bash
rm .htpasswd
```

### Create the Nginx Pod
1. Create the Nginx Pod
```bash
kubectl apply -f pod.yml -f nginx-config.yml -f busybox.yml
```
2.Check the status of your pod and get its IP address:
```bash
kubectl get pods -o wide
```
3. Try curl the ngnix pod's ip address without credentials. If you receive a 401 error, it means the htpasswd setting in ngnix pod is correct
```bash
kubectl exec busybox -- curl <NGINX_POD_IP>

# <h1>401 Authorization Required</h1>
```

4. now curl the ngnix pod's ip address with credentials
```bash
kubectl exec busybox -- curl -u user:<PASSWORD> <NGINX_POD_IP>

# <h1>Welcome to nginx!</h1>
```
