## Cheatsheet

Customerise the prompt name 
```bash
PS1='you-know-who'
```

Get the pod name of a pod with complicated name, and store it as an environment variable:
```bash
POD_NAME=$(kubectl get pods -l run=nginx -o jsonpath="{.items[0].metadata.name}")
```