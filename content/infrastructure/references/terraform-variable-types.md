---
title: "Terraform Variable Types"
description: "Reference for all Terraform variable types, their syntax, validation, and usage patterns."
pubDate: 2026-03-03
tags: ["terraform", "iac", "reference"]
order: 2
---

## Primitive Types

### string

```hcl
variable "environment" {
  type    = string
  default = "development"
}
```

### number

```hcl
variable "instance_count" {
  type    = number
  default = 2
}
```

### bool

```hcl
variable "enable_monitoring" {
  type    = bool
  default = true
}
```

## Collection Types

### list

Ordered sequence of values of the same type.

```hcl
variable "availability_zones" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

# Access: var.availability_zones[0]
```

### map

Key-value pairs where all values are the same type.

```hcl
variable "instance_tags" {
  type = map(string)
  default = {
    Environment = "production"
    Team        = "platform"
  }
}

# Access: var.instance_tags["Environment"]
```

### set

Unordered collection of unique values.

```hcl
variable "allowed_cidrs" {
  type    = set(string)
  default = ["10.0.0.0/8", "172.16.0.0/12"]
}
```

## Structural Types

### object

A collection of named attributes with specified types.

```hcl
variable "database_config" {
  type = object({
    engine         = string
    instance_class = string
    allocated_storage = number
    multi_az       = bool
  })
  default = {
    engine            = "postgres"
    instance_class    = "db.t3.medium"
    allocated_storage = 100
    multi_az          = true
  }
}
```

### tuple

A fixed-length sequence where each element can have a different type.

```hcl
variable "rule" {
  type    = tuple([string, number, bool])
  default = ["allow", 443, true]
}
```

## Special Types

### any

Lets Terraform infer the type.

```hcl
variable "settings" {
  type    = any
  default = {}
}
```

### optional()

Available in Terraform 1.3+. Makes object attributes optional with defaults.

```hcl
variable "config" {
  type = object({
    name     = string
    replicas = optional(number, 1)
    labels   = optional(map(string), {})
  })
}
```

## Validation

```hcl
variable "environment" {
  type = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}
```

## Sensitive Variables

```hcl
variable "db_password" {
  type      = string
  sensitive = true
}
```

Terraform redacts sensitive values from plan and apply output.
