---
title: "Understanding Container Networking"
description: "A deep dive into how container networking works, from network namespaces to CNI plugins in Kubernetes."
pubDate: 2026-03-08
tags: ["networking", "containers", "kubernetes"]
order: 2
---

## The Problem

Containers need to communicate with each other, the host, and the outside world — but they also need isolation. Container networking solves this tension.

## Network Namespaces

At the Linux kernel level, containers use **network namespaces** to get their own isolated network stack: interfaces, routing tables, and iptables rules.

```bash
# Create a network namespace
ip netns add container1

# View its interfaces (only loopback)
ip netns exec container1 ip link
```

## Virtual Ethernet Pairs (veth)

Containers connect to the host via **veth pairs** — virtual cables with one end in the container namespace and the other on the host.

```
┌─────────────┐     ┌─────────────┐
│  Container  │     │    Host     │
│   eth0 ─────┼─────┼── vethXXX  │
│             │     │      │      │
└─────────────┘     │   bridge0   │
                    └─────────────┘
```

## Bridge Networking

Docker's default networking uses a **bridge** (`docker0`). All containers on the same bridge can communicate via IP. The bridge handles ARP resolution and frame forwarding.

## Kubernetes Networking Model

Kubernetes has three requirements for any networking implementation:

1. Every pod gets its own IP address
2. Pods can communicate with each other without NAT
3. Agents on a node can communicate with all pods on that node

### CNI Plugins

The **Container Network Interface (CNI)** is the standard for configuring network interfaces in Linux containers. Popular CNI plugins:

- **Calico** - L3 networking with BGP, network policies
- **Cilium** - eBPF-based networking and security
- **Flannel** - Simple overlay network using VXLAN

## Service Networking

Kubernetes Services provide stable IPs and DNS names for sets of pods. `kube-proxy` (or its eBPF replacement in Cilium) handles the load balancing via iptables rules or IPVS.

## Key Takeaways

- Containers use Linux network namespaces for isolation
- veth pairs bridge the container and host network stacks
- Kubernetes requires flat networking — every pod can reach every other pod
- CNI plugins implement the actual networking (overlay, BGP, eBPF)
