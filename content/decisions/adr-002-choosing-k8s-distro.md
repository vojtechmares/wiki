---
title: "ADR-002: Choosing a Kubernetes Distribution (2026 revision)"
description: "Re-evaluating Kubernetes distributions for customer clusters — Talos with k3s/RKE2 fallback."
pubDate: 2026-06-05
status: accepted
tags: ["kubernetes", "infrastructure"]
---

## Context

This ADR supersedes [ADR-001](/decisions/adr-001-choosing-k8s-distro), which chose RKE2 for production clusters while evaluating only upstream Kubernetes, k3s, and RKE2.

Since that decision, both our experience and our requirements have changed. We now operate Kubernetes for **customer clusters**, which shifts the priorities toward ease of use and developer experience (DX), maintenance cost, extensibility, ecosystem, and tooling. This revision also takes the **operating system of Kubernetes nodes** into account, which the previous ADR did not.

Unless specified otherwise, the Linux distribution for Kubernetes nodes may be Debian, Ubuntu, or Rocky.

## Options Considered

### 1. Upstream Kubernetes with Flatcar Linux

- Most extensible option.
- Supports auto-updating and is reasonably secure.
- Allows debugging over SSH.
- Flatcar has no package manager — everything is done by rebuilding nodes.

### 2. k3s with any Linux distribution

- Very easy to set up and operate.
- Nice for small deployments thanks to the SQLite backend for single control-plane node setups.
- Maintenance can be a pain, and upgrading is manual.
- No support for provisioning Kubernetes via Terraform. Third-party Terraform modules exist, but historically they were not great.

### 3. RKE2 with any Linux distribution

- Nothing has changed in the RKE2 ecosystem since ADR-001.
- Essentially the same as k3s, but with changed defaults and hardened Helm charts.
- A FIPS-140 compliant Kubernetes distribution, which makes it interesting for clients with high security requirements that need compliant software.

### 4. k0s with any Linux distribution

- Very easy to set up, operate, and upgrade.
- System maintenance is still left to the administrator.
- Better maintenance thanks to k0sctl.
- k0smotron, with Cluster API support and multi-cluster setups, is nice.
- No Terraform support.

### 5. Talos

- A bit more complex to set up (a lot of configs), but it is a purpose-built Linux distribution for running Kubernetes.
- No SSH access to the nodes; everything is immutable.
- First-class Terraform support (Sidero-backed provider) and Cluster API support.
- Reasonable extensibility.
- Great agentic interactions — CLI, declarative configs, and similar are excellent when working with agents.
- Can be installed anywhere a custom image and Terraform are an option.

## Decision

**Talos, with a fallback to k3s/RKE2.**

We now have substantial Talos experience across several CNIs, storage systems, and similar components. Talos offers great versatility while keeping setup and operations simple, with really easy upgrades.

The fallback to k3s/RKE2 only makes sense in scenarios where it is impossible to bring in a custom Linux image, or where strict security requirements favour RKE2 (FIPS-140 compliance).

## Consequences

- **Positive:** Simple operations and really easy upgrades on an immutable, purpose-built OS.
- **Positive:** First-class Terraform (Sidero) and Cluster API support fit infrastructure-as-code and multi-cluster customer setups.
- **Positive:** Excellent CLI and declarative configuration make Talos pleasant to work with, including for agentic workflows.
- **Negative:** More upfront configuration to manage.
- **Negative:** No SSH access for ad-hoc debugging — everything goes through the declarative/immutable model.
- **Negative:** Requires environments where a custom image can be provisioned; otherwise the fallback applies.
- **Negative:** Maintaining a k3s/RKE2 fallback path means operating a second distribution model where Talos cannot be used.

## References

- [Talos Linux Documentation](https://www.talos.dev/)
- [Sidero Labs Terraform Provider](https://github.com/siderolabs/terraform-provider-talos)
- [Cluster API](https://cluster-api.sigs.k8s.io/)
- [RKE2 Documentation](https://docs.rke2.io/)
- [k3s Documentation](https://docs.k3s.io/)
- [k0s Documentation](https://docs.k0sproject.io/) and [k0smotron](https://docs.k0smotron.io/)
- [Flatcar Container Linux](https://www.flatcar.org/)
