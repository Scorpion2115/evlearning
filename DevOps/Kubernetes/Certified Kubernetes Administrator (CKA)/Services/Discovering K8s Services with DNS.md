# Discovering K8s Services with DNS
## Service DNS Names
The Kubernetes DNS assigns `DNS names` to services, allowing applications within the cluster to easily locate them.

A service's fully qualified domain name has the following format:

`<service-name>.<namespace>.svc.<cluster-domain-name>`

The default cluster domain is <span style="color:red">cluster.local</span>.

## Service DNS and Namespaces
Here is a typical service's fully qualified domain name:
<span style="color:red">my-service.my-namespace.svc.cluster.local</span>

* This domain can be used to reach the service from within `any namespaces` in the cluster
* For pod within the same namespace `my-namespace` can also simply use `my-service` as a shortly DNS name.