---
title: "ADR-001: Choosing a Kubernetes Distribution"
description: "Evaluating k3s, RKE2, and upstream Kubernetes for production clusters."
pubDate: 2024-03-15
status: accepted
tags: ["kubernetes", "infrastructure"]
---

## Context

We need a Kubernetes distribution for our production workloads. The team has experience with upstream Kubernetes but wants to evaluate lighter-weight alternatives that reduce operational overhead while maintaining compatibility with our existing tooling (Helm, ArgoCD, Kyverno).

## Options Considered

### 1. Upstream Kubernetes (kubeadm)

- Full control over every component
- Highest operational burden: manual etcd management, certificate rotation, upgrade orchestration
- No vendor lock-in

### 2. k3s

- Single-binary distribution, minimal resource footprint
- Replaces etcd with embedded SQLite (or external Postgres/MySQL)
- CNCF-certified conformant
- Concern: SQLite not suitable for HA production; external DB adds complexity back

### 3. RKE2

- "Government-grade" Kubernetes from Rancher/SUSE
- Embedded etcd, CIS-hardened by default
- Ships with containerd (no Docker dependency)
- Familiar upgrade path via system packages or Rancher UI

## Decision

**RKE2** for production clusters.

It strikes the best balance between operational simplicity and production readiness. CIS hardening out of the box reduces our security baseline effort, and embedded etcd avoids the external datastore question. The Rancher ecosystem gives us a migration path to multi-cluster management when needed.

## Consequences

- **Positive:** Reduced time-to-production for new clusters; built-in CIS compliance reduces audit prep work.
- **Positive:** etcd is co-located but managed — no separate etcd cluster to maintain.
- **Negative:** Tighter coupling to Rancher ecosystem; switching distributions later requires migration effort.
- **Negative:** Slightly larger resource footprint than k3s on edge/dev nodes.

## References

- [RKE2 Documentation](https://docs.rke2.io/)
- [CIS Benchmark for Kubernetes](https://www.cisecurity.org/benchmark/kubernetes)
