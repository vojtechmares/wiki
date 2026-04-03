---
title: "Setting Up CI/CD with GitHub Actions"
description: "Learn how to create a complete CI/CD pipeline using GitHub Actions for building, testing, and deploying applications."
pubDate: 2026-03-18
tags: ["ci-cd", "github-actions", "automation"]
order: 2
---

## What You'll Build

In this tutorial, you'll create a GitHub Actions workflow that:

1. Runs tests on every pull request
2. Builds a Docker image on merge to main
3. Deploys to a staging environment

## Step 1: Create the Workflow File

Create `.github/workflows/ci.yml` in your repository:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test

  build:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
```

## Step 2: Configure Secrets

Go to your repository settings and add the following secrets:

- `REGISTRY_TOKEN` - Your container registry token
- `DEPLOY_KEY` - SSH key for deployment

## Step 3: Add a Deployment Step

Extend the workflow with a deployment job:

```yaml
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying to staging..."
```

## Summary

You now have a working CI/CD pipeline that automatically tests, builds, and deploys your application.
