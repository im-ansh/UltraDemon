#!/bin/bash
# UltraSearch — One-command Cloudflare Deploy Script
# Usage: ./deploy.sh [dev|prod]

set -e

ENV=${1:-prod}
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}⚡ UltraSearch — Cloudflare Deploy${NC}"
echo "Environment: $ENV"
echo "────────────────────────────────────────"

# 1. Install deps
echo -e "${YELLOW}[1/5] Installing dependencies...${NC}"
npm install

# 2. Create D1 database (safe to run multiple times)
echo -e "${YELLOW}[2/5] Setting up D1 database...${NC}"
wrangler d1 create ultrasearch-db 2>/dev/null || echo "  (D1 already exists — OK)"

# 3. Create KV namespaces
echo -e "${YELLOW}[3/5] Setting up KV namespaces...${NC}"
wrangler kv namespace create SEARCH_CACHE 2>/dev/null || echo "  (SEARCH_CACHE KV already exists — OK)"
wrangler kv namespace create KEY_CACHE 2>/dev/null || echo "  (KEY_CACHE KV already exists — OK)"

# 4. Run D1 migrations
echo -e "${YELLOW}[4/5] Running D1 migrations...${NC}"
if [ "$ENV" = "dev" ]; then
  wrangler d1 migrations apply ultrasearch-db --local
else
  wrangler d1 migrations apply ultrasearch-db
fi

# 5. Set secrets (prompt user)
echo -e "${YELLOW}[5/5] Setting secrets...${NC}"
echo ""
echo "You need to set the following secrets (press Enter to skip if already set):"
echo ""

read -p "ULTRASEARCH_SECRET (random string for signing keys): " SECRET
[ -n "$SECRET" ] && echo "$SECRET" | wrangler secret put ULTRASEARCH_SECRET

read -p "BRAVE_API_KEY (from api.search.brave.com, optional): " BRAVE
[ -n "$BRAVE" ] && echo "$BRAVE" | wrangler secret put BRAVE_API_KEY

read -p "SERPER_API_KEY (from serper.dev, optional): " SERPER
[ -n "$SERPER" ] && echo "$SERPER" | wrangler secret put SERPER_API_KEY

read -p "EXA_API_KEY (from exa.ai, optional): " EXA
[ -n "$EXA" ] && echo "$EXA" | wrangler secret put EXA_API_KEY

read -p "TAVILY_API_KEY (from tavily.com, optional): " TAVILY
[ -n "$TAVILY" ] && echo "$TAVILY" | wrangler secret put TAVILY_API_KEY

# 6. Deploy!
echo ""
echo -e "${YELLOW}Deploying to Cloudflare Workers...${NC}"
if [ "$ENV" = "dev" ]; then
  wrangler dev
else
  wrangler deploy
fi

echo ""
echo -e "${GREEN}✅ UltraSearch deployed to Cloudflare Workers!${NC}"
echo ""
echo "Your API is live at:"
wrangler deployments list 2>/dev/null | grep "https://" | head -1 || \
  echo "  https://ultrasearch-api.<your-subdomain>.workers.dev"
echo ""
echo "Next steps:"
echo "  1. Create your first API key:"
echo "     curl -X POST https://ultrasearch-api.<subdomain>.workers.dev/v1/keys \\"
echo "       -H 'Content-Type: application/json' \\"
echo "       -d '{\"user_id\": \"me\", \"plan\": \"free\"}'"
echo ""
echo "  2. Run a search:"
echo "     curl 'https://ultrasearch-api.<subdomain>.workers.dev/v1/search?q=hello+world' \\"
echo "       -H 'X-API-Key: us_your_key_here'"
echo ""
echo "  3. Add to Claude Desktop / Cursor (MCP):"
echo "     Endpoint: https://ultrasearch-api.<subdomain>.workers.dev/mcp"
