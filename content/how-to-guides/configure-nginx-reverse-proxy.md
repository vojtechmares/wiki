---
title: "Configure Nginx as a Reverse Proxy"
description: "How to set up Nginx as a reverse proxy for your application with SSL termination and load balancing."
pubDate: 2026-03-15
tags: ["nginx", "reverse-proxy", "ssl"]
order: 1
---

## Goal

Set up Nginx to proxy requests to a backend application running on port 3000, with SSL termination.

## Prerequisites

- Nginx installed (`apt install nginx`)
- SSL certificate (use Let's Encrypt with certbot)
- Backend application running on `localhost:3000`

## Configuration

Create `/etc/nginx/sites-available/app.conf`:

```nginx
upstream backend {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name app.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.example.com;

    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Enable and Test

```bash
sudo ln -s /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Troubleshooting

- **502 Bad Gateway**: Check if your backend is running on the specified port
- **Permission denied**: Ensure Nginx can connect to the upstream (check SELinux if applicable)
