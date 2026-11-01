#!/bin/bash
# UltraSearch — 100% Autonomous Infrastructure Setup
# Prepares D1 database, applies FTS5 schema, and configures Cloudflare edge secrets.
# Zero 3rd-party search APIs required.

set -e
BLUE='\033[0;34m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

echo -e "${BLUE}"
echo "  ⚡ UltraSearch — Autonomous Cloudflare Edge Setup"
echo "  No Brave. No Google. 100% Self-Hosted Search Index."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

WRANGLER="npx wrangler"

# 1. Check or set ULTRASEARCH_SECRET
echo -e "${YELLOW}[1/2] Configuring security secrets...${NC}"
RAND_SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))" 2>/dev/null || openssl rand -hex 32 2>/dev/null || echo "ultrasearch_master_secret_edge_2026")
echo "$RAND_SECRET" | $WRANGLER secret put ULTRASEARCH_SECRET
echo -e "  ${GREEN}✅ ULTRASEARCH_SECRET configured.${NC}"

# 2. Apply D1 Database Migrations (creates FTS5 tables & starter seed corpus)
echo -e "${YELLOW}[2/2] Applying D1 Database Schema & FTS5 Index...${NC}"
$WRANGLER d1 migrations apply ultrasearch-db --remote || $WRANGLER d1 migrations apply ultrasearch-db

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Autonomous infrastructure is ready!${NC}"
echo -e "${GREEN}  Run: npx wrangler deploy${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
