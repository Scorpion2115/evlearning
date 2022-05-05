# Scaling Applications with Deployments
## What is scaling
Scaling refers to dedicate more or fewer resources to an application to meet changing request

## Deployment Scaling
The deployment's `replicas` setting determines how many replicas are desired in its desired state

## How to scale a deployment
1. Edit `deployment` yaml file
2. Use kubectl scale command: `kubectl scale deployment.v1.apps/<deployment name> --replicas=3`