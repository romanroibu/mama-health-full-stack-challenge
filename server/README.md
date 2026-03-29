# Server

## Setup for development

Requirements:
- `python 3.13+`
- `uv`

```bash
# 1. Install dependencies
uv sync
# 2. Generate Prisma client
uv run prisma generate
```

## Running via Docker Compose


```bash
docker compose up --build
```
