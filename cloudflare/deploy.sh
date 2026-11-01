#!/bin/bash
# UltraSearch — One-command Autonomous Cloudflare Deploy Script
# Usage: ./deploy.sh

set -e

BLUE='\033[0;34m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

echo -e "${BLUE}⚡ UltraSearch — Deploying Autonomous Search Engine to Edge${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Install deps
echo -e "${YELLOW}[1/3] Checking dependencies...${NC}"
npm install

# 2. Run D1 migrations
echo -e "${YELLOW}[2/3] Applying D1 FTS5 database migrations...${NC}"
npx wrangler d1 migrations apply ultrasearch-db --remote

# 3. Deploy Worker
echo -e "${YELLOW}[3/3] Deploying Worker to Cloudflare edge...${NC}"
npx wrangler deploy

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ UltraSearch is LIVE on Cloudflare Edge!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Endpoints:"
echo "  • Search:  POST /v1/search"
echo "  • Keys:    POST /v1/keys"
echo "  • Crawler: POST /v1/crawl"
echo "  • Stats:   GET  /v1/crawler/stats"
echo "  • MCP:     POST /mcp & GET /mcp/sse"
echo ""
