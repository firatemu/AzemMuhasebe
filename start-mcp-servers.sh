#!/bin/bash
echo "MCP sunucuları başlatılıyor (muhasebe)..."

ROOT="/home/azem/projects/muhasebe"

npx -y @modelcontextprotocol/server-filesystem "$ROOT" &
echo "✓ filesystem"

npx -y @modelcontextprotocol/server-memory &
echo "✓ memory"

npx -y @modelcontextprotocol/server-git --repository "$ROOT" &
echo "✓ git"

echo "Tamamlandı."
