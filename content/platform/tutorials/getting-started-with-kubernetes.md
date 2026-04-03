---
title: "Getting Started with Kubernetes"
description: "A step-by-step tutorial for deploying your first application on Kubernetes using kubectl and manifests."
pubDate: 2026-03-20
tags: ["kubernetes", "containers", "beginner"]
order: 1
---

## Prerequisites

Before you begin, make sure you have the following installed:

- [kubectl](https://kubernetes.io/docs/tasks/tools/) - The Kubernetes command-line tool
- [minikube](https://minikube.sigs.k8s.io/docs/start/) or access to a Kubernetes cluster
- [Docker](https://docs.docker.com/get-docker/) - For building container images

## Step 1: Start Your Cluster

If you're using minikube, start a local cluster:

```bash
minikube start
```

Verify the cluster is running:

```bash
kubectl cluster-info
```

## Step 2: Create a Deployment

Create a file called `deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-app
  labels:
    app: hello
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello
  template:
    metadata:
      labels:
        app: hello
    spec:
      containers:
        - name: hello
          image: gcr.io/google-samples/hello-app:1.0
          ports:
            - containerPort: 8080
```

Apply the deployment:

```bash
kubectl apply -f deployment.yaml
```

## Step 3: Expose the Service

Create a Service to make your application accessible:

```bash
kubectl expose deployment hello-app --type=NodePort --port=8080
```

## Step 4: Verify Everything Works

Check the status of your pods:

```bash
kubectl get pods
kubectl get services
```

Access your application:

```bash
minikube service hello-app
```

## Next Steps

- Learn about [ConfigMaps and Secrets](/how-to-guides/configure-nginx-reverse-proxy)
- Understand [container networking](/explanations/understanding-container-networking)
- Check the [kubectl cheat sheet](/references/kubectl-cheat-sheet)
