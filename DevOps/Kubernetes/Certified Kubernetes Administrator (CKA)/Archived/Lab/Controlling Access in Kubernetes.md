# Controlling Access in Kubernetes
Create a basic ServiceAccount.
```yml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-serviceaccount
  namespace: my-ns
```
We can also Create a ServiceAccount with an imperative command.
```bash
kubectl create sa my-serviceaccount2 -n my-ns
 ```

1. Create a `role.yml` file
```yml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: my-ns
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "watch", "list"]
```

2. Create `rolebinding.yml` file
```yml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pod-reader
  namespace: my-ns
subjects:
- kind: ServiceAccount
  name: my-serviceaccount
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

3. Create Role and RoleBinding