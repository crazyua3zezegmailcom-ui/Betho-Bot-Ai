#!/bin/bash
# ================================================
#  BETHO BOT — Server Setup Script
#  Run this once on a fresh Linux server (Ubuntu/Debian)
#  Usage: bash setup.sh
# ================================================

set -e

echo ""
echo "╔══════════════════════════════════════╗"
echo "║      BETHO BOT — Server Setup        ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ─── 1. System packages ───────────────────────
echo "📦 Installing system dependencies..."
apt-get update -y
apt-get install -y \
    ffmpeg \
    imagemagick \
    graphicsmagick \
    libpixman-1-dev \
    librsvg2-dev \
    libgif-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libcairo2-dev \
    pkg-config \
    python3 \
    python3-pip \
    build-essential \
    git \
    curl \
    unzip \
    util-linux

echo "✅ System dependencies installed."

# ─── 2. Node.js >= 20 ─────────────────────────
echo ""
echo "🟢 Checking Node.js version..."
if command -v node &>/dev/null; then
    NODE_VER=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
    if [ "$NODE_VER" -ge 20 ]; then
        echo "✅ Node.js v$(node -v) is already installed."
    else
        echo "⚠️ Node.js v$(node -v) is too old. Installing Node.js 20..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    fi
else
    echo "⬇️ Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
echo "✅ Node.js $(node -v) ready."

# ─── 3. npm packages ──────────────────────────
echo ""
echo "📦 Installing npm packages..."
npm install
echo "✅ npm packages installed."

# ─── 4. Required directories ──────────────────
echo ""
echo "📁 Creating required directories..."
mkdir -p Sessions/Principal
mkdir -p Sessions/SubBot
mkdir -p tmp
echo "✅ Directories ready."

# ─── 5. Permissions ───────────────────────────
chmod +x setup.sh

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   ✅ Setup complete! Run the bot:    ║"
echo "║          npm start                   ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "⚠️  IMPORTANT: Copy your Sessions/Principal folder"
echo "    from the old server to keep your WhatsApp session."
echo "    Without it, you'll need to re-pair the bot."
echo ""
