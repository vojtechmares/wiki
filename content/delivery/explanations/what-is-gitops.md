---
title: "What is GitOps?"
description: "An explanation of the GitOps methodology, its principles, and how it changes the way teams manage infrastructure and deployments."
pubDate: 2026-03-10
tags: ["gitops", "infrastructure", "methodology"]
order: 1
---

## Overview

GitOps is an operational framework that applies DevOps best practices used for application development — such as version control, collaboration, compliance, and CI/CD — to infrastructure automation.

## Core Principles

### 1. Declarative Configuration

The entire system is described declaratively. Instead of writing imperative scripts that describe *how* to reach a state, you declare *what* the desired state looks like.

```yaml
# Declarative: what you want
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
```

### 2. Git as the Single Source of Truth

Git repositories hold the complete desired state of your infrastructure. Every change goes through a pull request, providing an audit trail, review process, and rollback mechanism.

### 3. Automated Reconciliation

An operator continuously compares the actual state of the system with the desired state in Git. When drift is detected, the operator automatically reconciles the difference.

### 4. Pull-Based Deployment

Unlike traditional CI/CD where a pipeline *pushes* changes to the cluster, GitOps agents *pull* changes from Git. This is more secure because the cluster doesn't need to expose credentials to the CI system.

## GitOps vs Traditional CI/CD

| Aspect | Traditional CI/CD | GitOps |
|--------|------------------|--------|
| Deployment trigger | Pipeline push | Git commit + reconciliation |
| Source of truth | CI server config | Git repository |
| Drift detection | Manual / none | Automatic |
| Rollback | Re-run pipeline | `git revert` |

## Tools

- **Flux** - CNCF graduated project for Kubernetes GitOps
- **ArgoCD** - Declarative continuous delivery for Kubernetes
- **Crossplane** - Extends GitOps to cloud infrastructure

## When to Use GitOps

GitOps works best when:

- You manage multiple environments (dev, staging, prod)
- You need a clear audit trail of all changes
- You want automated drift detection and correction
- Your team is already comfortable with Git workflows
