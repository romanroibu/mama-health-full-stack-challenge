FROM python:3.13-bookworm

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1

RUN pip install --no-cache-dir uv

# Copy dependency manifests first for better caching
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Generate Prisma client as a dedicated build step
COPY prisma ./prisma
RUN uv run prisma generate

# Copy source code after dependency and generation steps
COPY app ./app
COPY README.md ./

EXPOSE 8000

CMD ["sh", "-c", "uv run prisma migrate deploy && uv run uvicorn app.main:app --host 0.0.0.0 --port 8000"]
