# ── Base image ──────────────────────────────────────────────────────────────
# We start from an official Python image (like FROM node:latest in the lecture)
FROM python:3.11-slim

# ── Working directory ────────────────────────────────────────────────────────
# All following commands run inside /app inside the container
WORKDIR /app

# ── Install dependencies ─────────────────────────────────────────────────────
# Copy requirements first so Docker can cache this layer.
# If only code changes (not requirements), Docker skips reinstalling packages.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Copy application code ────────────────────────────────────────────────────
COPY . .

# ── Expose port ──────────────────────────────────────────────────────────────
# The port FastAPI listens on (same as EXPOSE 3000 in the lecture example)
EXPOSE 8000

# ── Start command ────────────────────────────────────────────────────────────
# uvicorn is the server that runs FastAPI
# --host 0.0.0.0 makes it reachable from outside the container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
