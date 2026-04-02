---
title: "Debug OOM Kills in Kubernetes"
description: "How to identify, diagnose, and fix out-of-memory kills in Kubernetes pods."
pubDate: 2026-03-12
tags: ["kubernetes", "debugging", "memory"]
order: 2
---

## Problem

Your pods are being killed with `OOMKilled` status and you need to find out why.

## Step 1: Identify the OOM Kill

```bash
kubectl get pods -o wide
kubectl describe pod <pod-name>
```

Look for `Last State: Terminated` with `Reason: OOMKilled` in the output.

## Step 2: Check Resource Limits

```bash
kubectl get pod <pod-name> -o jsonpath='{.spec.containers[*].resources}'
```

If no memory limits are set, the pod can consume all node memory before being killed by the kernel OOM killer.

## Step 3: Analyze Memory Usage

Use metrics-server or Prometheus to check actual memory consumption:

```bash
kubectl top pod <pod-name> --containers
```

## Step 4: Fix the Issue

**Option A: Increase memory limits** (if the app legitimately needs more):

```yaml
resources:
  requests:
    memory: "256Mi"
  limits:
    memory: "512Mi"
```

**Option B: Fix the memory leak** in your application. Common causes:

- Unbounded caches
- Connection pool leaks
- Large file processing without streaming

## Prevention

Set resource requests and limits on all containers. Use a `LimitRange` to enforce defaults at the namespace level.
