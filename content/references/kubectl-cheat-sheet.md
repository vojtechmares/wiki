---
title: "kubectl Cheat Sheet"
description: "Quick reference for the most commonly used kubectl commands for managing Kubernetes clusters."
pubDate: 2026-03-05
tags: ["kubernetes", "kubectl", "reference"]
order: 1
---

## Cluster Info

```bash
kubectl cluster-info
kubectl get nodes
kubectl get namespaces
kubectl api-resources
```

## Pods

```bash
# List pods
kubectl get pods
kubectl get pods -A                    # All namespaces
kubectl get pods -o wide               # Extended info
kubectl get pods -w                    # Watch for changes

# Describe a pod
kubectl describe pod <name>

# Logs
kubectl logs <pod>
kubectl logs <pod> -c <container>      # Specific container
kubectl logs <pod> -f                  # Follow
kubectl logs <pod> --previous          # Previous instance

# Execute commands
kubectl exec -it <pod> -- /bin/sh
kubectl exec <pod> -- cat /etc/config
```

## Deployments

```bash
kubectl get deployments
kubectl describe deployment <name>
kubectl scale deployment <name> --replicas=3
kubectl rollout status deployment <name>
kubectl rollout undo deployment <name>
kubectl rollout history deployment <name>
```

## Services

```bash
kubectl get services
kubectl get endpoints
kubectl describe service <name>
kubectl port-forward svc/<name> 8080:80
```

## ConfigMaps and Secrets

```bash
# ConfigMaps
kubectl create configmap <name> --from-file=config.yaml
kubectl create configmap <name> --from-literal=key=value
kubectl get configmaps

# Secrets
kubectl create secret generic <name> --from-literal=password=s3cr3t
kubectl get secrets
kubectl get secret <name> -o jsonpath='{.data.password}' | base64 -d
```

## Resource Management

```bash
kubectl top nodes
kubectl top pods
kubectl top pods --containers
kubectl describe node <name>           # Check allocatable resources
```

## Troubleshooting

```bash
kubectl get events --sort-by=.lastTimestamp
kubectl get events -w                  # Watch events
kubectl debug pod/<name> -it --image=busybox
kubectl run tmp --image=busybox --rm -it -- /bin/sh
```

## Context and Config

```bash
kubectl config get-contexts
kubectl config use-context <name>
kubectl config set-context --current --namespace=<ns>
```
