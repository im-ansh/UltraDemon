"""
UltraSearch API — Vercel entrypoint
Exposes the FastAPI application instance for Vercel Serverless Functions.
"""

from src.api.server import app

__all__ = ["app"]

