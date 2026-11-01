#!/bin/bash
# UltraSearch — Auto-setup script
# Creates D1 + KV resources and patches wrangler.toml with real IDs automatically.
# Run this ONCE before deploying.

set -e
BLUE='\033[0;34m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

echo -e "${BLUE}"
echo "  ⚡ UltraSearch — Cloudflare Resource Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

# Check wrangler is installed + logged in
if ! command -v wrangler &>/dev/null && ! npx wrangler --version &>/dev/null 2>&1; then
  echo -e "${RED}✘ wrangler not found. Run: npm install -g wrangler${NC}"; exit 1
fi
WRANGLER="npx wrangler"

echo -e "${YELLOW}[1/5] Creating D1 database...${NC}"
D1_OUTPUT=$($WRANGLER d1 create ultrasearch-db 2>&1 || true)
echo "$D1_OUTPUT"
D1_ID=$(echo "$D1_OUTPUT" | grep -oP 'database_id\s*=\s*"\K[^"]+' || \
        $WRANGLER d1 list 2>/dev/null | grep "ultrasearch-db" | awk '{print $NF}' || echo "")

if [ -z "$D1_ID" ]; then
  # Already exists — get existing ID
  D1_ID=$($WRANGLER d1 list 2>/dev/null | grep "ultrasearch-db" | grep -oP '[0-9a-f-]{36}' | head -1 || echo "")
fi
echo -e "  D1 ID: ${GREEN}${D1_ID}${NC}"

echo -e "${YELLOW}[2/5] Creating KV namespaces...${NC}"
SC_OUTPUT=$($WRANGLER kv namespace create SEARCH_CACHE 2>&1 || true)
SC_ID=$(echo "$SC_OUTPUT" | grep -oP 'id\s*=\s*"\K[^"]+' | head -1 || echo "")
[ -z "$SC_ID" ] && SC_ID=$($WRANGLER kv namespace list 2>/dev/null | python3 -c "import sys,json; data=json.load(sys.stdin); [print(n['id']) for n in data if 'SEARCH_CACHE' in n.get('title','')]" 2>/dev/null | head -1 || echo "placeholder")
echo "  SEARCH_CACHE ID: $SC_ID"

KC_OUTPUT=$($WRANGLER kv namespace create KEY_CACHE 2>&1 || true)
KC_ID=$(echo "$KC_OUTPUT" | grep -oP 'id\s*=\s*"\K[^"]+' | head -1 || echo "")
[ -z "$KC_ID" ] && KC_ID=$($WRANGLER kv namespace list 2>/dev/null | python3 -c "import sys,json; data=json.load(sys.stdin); [print(n['id']) for n in data if 'KEY_CACHE' in n.get('title','')]" 2>/dev/null | head -1 || echo "placeholder")
echo "  KEY_CACHE ID:    $KC_ID"

# Preview IDs (for wrangler dev)
SC_PREVIEW=$($WRANGLER kv namespace create SEARCH_CACHE --preview 2>&1 | grep -oP 'id\s*=\s*"\K[^"]+' | head -1 || echo "$SC_ID")
KC_PREVIEW=$($WRANGLER kv namespace create KEY_CACHE --preview 2>&1 | grep -oP 'id\s*=\s*"\K[^"]+' | head -1 || echo "$KC_ID")

echo -e "${YELLOW}[3/5] Patching wrangler.toml with real IDs...${NC}"
sed -i.bak \
  -e "s|PASTE_YOUR_D1_ID_HERE|${D1_ID}|g" \
  -e "s|PASTE_SEARCH_CACHE_KV_ID|${SC_ID}|g" \
  -e "s|PASTE_SEARCH_CACHE_KV_PREVIEW_ID|${SC_PREVIEW}|g" \
  -e "s|PASTE_KEY_CACHE_KV_ID|${KC_ID}|g" \
  -e "s|PASTE_KEY_CACHE_KV_PREVIEW_ID|${KC_PREVIEW}|g" \
  wrangler.toml
rm -f wrangler.toml.bak
echo "  ✅ wrangler.toml updated"

echo -e "${YELLOW}[4/5] Running D1 migrations...${NC}"
$WRANGLER d1 migrations apply ultrasearch-db || echo "  (skipped — run manually if needed)"

echo -e "${YELLOW}[5/5] Setting secrets...${NC}"
echo ""
# Generate a random secret if not set
RAND_SECRET=$(openssl rand -hex 32 2>/dev/null || python3 -c "import secrets; print(secrets.token_hex(32))")
echo "$RAND_SECRET" | $WRANGLER secret put ULTRASEARCH_SECRET
echo "  ✅ ULTRASEARCH_SECRET set"

for SECRET_NAME in BRAVE_API_KEY SERPER_API_KEY EXA_API_KEY TAVILY_API_KEY; do
  read -p "  $SECRET_NAME (press Enter to skip): " VAL
  [ -n "$VAL" ] && echo "$VAL" | $WRANGLER secret put "$SECRET_NAME" && echo "  ✅ $SECRET_NAME set"
done

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Setup complete! Now run: npx wrangler deploy${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
