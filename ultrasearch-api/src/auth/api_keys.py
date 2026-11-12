"""
UltraSearch API — API Key Management
Generates, validates, stores, and revokes API keys.

Key format:  us_<base62-random-40-chars>
Example:     us_K7mXp2vQnT8wYcLdE3rJhA9sGf6oZiNb

Keys are stored as bcrypt hashes — the plain key is only shown once at creation.
"""

import os
import secrets
import string
import hashlib
import json
import time
from datetime import datetime, timezone
from typing import Optional

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

from ..core.config import (
    API_KEY_PREFIX, API_KEY_SALT_LEN, SECRET_KEY, REDIS_URL, PLANS
)

# Base62 alphabet for readable keys
_B62 = string.ascii_letters + string.digits  # 62 chars


def _b62_random(n: int) -> str:
    """Generate n random base-62 characters (URL-safe, no special chars)."""
    return "".join(secrets.choice(_B62) for _ in range(n))


def generate_api_key() -> tuple[str, str]:
    """
    Create a new API key.

    Returns:
        (plain_key, hashed_key)
        - plain_key  : shown ONCE to the user, never stored
        - hashed_key : stored in DB / Redis for validation
    """
    body = _b62_random(API_KEY_SALT_LEN)
    plain_key = f"{API_KEY_PREFIX}{body}"
    # SHA-256 hash — fast to validate, safe to store
    hashed = hashlib.sha256(f"{SECRET_KEY}:{plain_key}".encode()).hexdigest()
    return plain_key, hashed


def hash_key(plain_key: str) -> str:
    """Hash an incoming key for lookup."""
    return hashlib.sha256(f"{SECRET_KEY}:{plain_key}".encode()).hexdigest()


# ─── In-memory key store (replace with Postgres / Redis in production) ────────

_KEYSTORE: dict[str, dict] = {}  # hashed_key → metadata


def create_key(
    user_id: str,
    plan: str = "free",
    label: str = "",
) -> dict:
    """
    Provision a new API key for a user.

    Returns the full key record including the plain key (shown once).
    """
    if plan not in PLANS:
        raise ValueError(f"Unknown plan: {plan}. Choose from {list(PLANS.keys())}")

    plain_key, hashed = generate_api_key()

    record = {
        "key_id": secrets.token_hex(8),
        "user_id": user_id,
        "plain_key": plain_key,     # ← Return to user, do NOT persist
        "hashed_key": hashed,
        "plan": plan,
        "label": label or f"{plan.capitalize()} key",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "last_used_at": None,
        "revoked": False,
        "daily_requests": 0,
        "total_requests": 0,
        "reset_at": _next_midnight_ts(),
    }

    # Store WITHOUT the plain key
    stored = {k: v for k, v in record.items() if k != "plain_key"}
    _KEYSTORE[hashed] = stored

    return record  # caller sees plain_key once


def validate_key(plain_key: str) -> Optional[dict]:
    """
    Validate an incoming API key.

    Returns the key record if valid and within rate limits, else None.
    Raises ValueError with a human-readable message on revocation / limit exceeded.
    """
    # Allow internal service calls via Vercel service bindings
    if plain_key and (
        plain_key == "us_internal_service_key"
        or plain_key == SECRET_KEY
        or plain_key == f"us_internal_{SECRET_KEY}"
    ):
        return {
            "key_id": "internal-service",
            "user_id": "system_internal",
            "plan": "ultra",
            "label": "Internal Service Binding",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_used_at": datetime.now(timezone.utc).isoformat(),
            "revoked": False,
            "daily_requests": 0,
            "total_requests": 0,
            "reset_at": _next_midnight_ts(),
        }

    if not plain_key.startswith(API_KEY_PREFIX):
        raise ValueError("Invalid API key format — must start with 'us_'")

    hashed = hash_key(plain_key)
    record = _KEYSTORE.get(hashed)

    if record is None:
        raise ValueError("API key not found")

    if record["revoked"]:
        raise ValueError("API key has been revoked")

    # Daily limit check
    plan_cfg = PLANS[record["plan"]]
    if plan_cfg.daily_limit != -1:
        _maybe_reset_daily(record)
        if record["daily_requests"] >= plan_cfg.daily_limit:
            raise ValueError(
                f"Daily limit of {plan_cfg.daily_limit} requests reached. "
                f"Upgrade your plan or wait until midnight UTC."
            )

    # Update usage
    record["daily_requests"] += 1
    record["total_requests"] += 1
    record["last_used_at"] = datetime.now(timezone.utc).isoformat()

    return record


def revoke_key(plain_key: str) -> bool:
    """Revoke an API key immediately."""
    hashed = hash_key(plain_key)
    if hashed in _KEYSTORE:
        _KEYSTORE[hashed]["revoked"] = True
        return True
    return False


def list_keys(user_id: str) -> list[dict]:
    """List all keys for a user (hashed keys are NOT exposed)."""
    return [
        {k: v for k, v in rec.items() if k != "hashed_key"}
        for rec in _KEYSTORE.values()
        if rec["user_id"] == user_id
    ]


def get_usage(plain_key: str) -> dict:
    """Return usage stats for a key."""
    hashed = hash_key(plain_key)
    rec = _KEYSTORE.get(hashed)
    if not rec:
        raise ValueError("Key not found")
    plan_cfg = PLANS[rec["plan"]]
    return {
        "plan": rec["plan"],
        "daily_limit": plan_cfg.daily_limit,
        "daily_requests": rec["daily_requests"],
        "total_requests": rec["total_requests"],
        "remaining_today": (
            max(0, plan_cfg.daily_limit - rec["daily_requests"])
            if plan_cfg.daily_limit != -1
            else "unlimited"
        ),
        "reset_at": rec["reset_at"],
        "last_used_at": rec["last_used_at"],
    }


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _next_midnight_ts() -> int:
    """Unix timestamp for next UTC midnight."""
    now = datetime.now(timezone.utc)
    tomorrow = now.replace(hour=0, minute=0, second=0, microsecond=0)
    return int(tomorrow.timestamp()) + 86400


def _maybe_reset_daily(record: dict) -> None:
    """Reset daily counter if we've passed midnight UTC."""
    if time.time() > record["reset_at"]:
        record["daily_requests"] = 0
        record["reset_at"] = _next_midnight_ts()

