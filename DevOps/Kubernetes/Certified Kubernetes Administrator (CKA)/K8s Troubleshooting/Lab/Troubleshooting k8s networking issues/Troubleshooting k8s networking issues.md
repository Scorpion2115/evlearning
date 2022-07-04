# Troubleshooting k8s networking issues
1. Create a simple Nginx Pod to use for testing, as well as a service to expose it:
```bash
kubectl apply -f nginx-netshoot.yml
```

2. Create a Pod running the `netshoot` image in a container:
```bash
kubectl apply -f netshoot.yml
```