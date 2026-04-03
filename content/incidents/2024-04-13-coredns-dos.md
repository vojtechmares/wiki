---
title: "CoreDNS Denial-of-Service in Production Cluster"
description: "A misconfigured CoreDNS forward plugin caused cascading DNS failures across all production workloads for 47 minutes."
pubDate: 2024-04-13
severity: critical
tags: ["kubernetes", "dns", "security", "networking"]
---

## Summary

On April 13 2024, a routine CoreDNS configuration change introduced a forwarding loop that exhausted DNS resolver capacity. All production services relying on cluster DNS experienced degraded name resolution for 47 minutes, resulting in elevated 5xx error rates across customer-facing APIs.

## Timeline

| Time (UTC) | Event |
|------------|-------|
| 14:02 | Engineer applies updated CoreDNS ConfigMap to enable conditional forwarding for `internal.corp` zone |
| 14:05 | Monitoring detects spike in CoreDNS pod CPU and memory usage |
| 14:08 | First PagerDuty alert fires: `CoreDNS latency > 500ms` |
| 14:12 | API gateway error rate crosses 10% threshold; customer impact begins |
| 14:18 | On-call engineer begins investigation, suspects upstream resolver issue |
| 14:31 | Root cause identified: forward plugin creates loop between CoreDNS and itself on `:53` |
| 14:34 | ConfigMap rolled back to previous version |
| 14:42 | CoreDNS pods stabilize; DNS resolution latency returns to baseline |
| 14:49 | All downstream services recover; incident marked resolved |

## Root Cause

The updated ConfigMap added a `forward` block for the `internal.corp` zone that pointed to the cluster's own `kube-dns` service IP. Because CoreDNS *is* the backend for `kube-dns`, this created a forwarding loop. Each incoming query generated another query to itself, consuming CPU and socket buffers until the pods hit OOM limits and began crash-looping.

```
internal.corp:53 {
    forward . 10.96.0.10   # <- this IS kube-dns / CoreDNS itself
}
```

The correct target should have been the corporate DNS resolver at `10.200.0.53`.

## Impact

- **Duration:** 47 minutes (14:02 – 14:49 UTC)
- **User-facing:** ~12% of API requests returned 5xx during the window
- **Internal:** All cluster-internal service-to-service calls using DNS experienced intermittent failures
- **Data loss:** None confirmed

## Action Items

- [ ] Add OPA/Kyverno policy to reject CoreDNS ConfigMap changes that reference `kube-dns` cluster IP as a forward target
- [ ] Implement canary rollout for CoreDNS config changes using a staging namespace
- [ ] Add synthetic DNS probe that alerts within 60s of resolution failure
- [ ] Document CoreDNS change procedure in the how-to guide

## Lessons Learned

- [How-To: Safe CoreDNS Configuration Changes](/infrastructure/how-to-guides/coredns-config-changes/) (to be created)
- [ADR: Require Policy Validation for DNS Infrastructure Changes](/platform/references/adr-dns-policy-validation/) (to be created)
