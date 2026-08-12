#!/bin/bash
# ============================================================
#  ARGES Platform — Netlify Deploy Script
#  Deploys frontend to Netlify
# ============================================================

set -e

echo "============================================"
echo "  ARGES — Netlify Deployment"
echo "============================================"
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

echo ""
echo "Choose deployment option:"
echo "  1) Quick deploy (no login — creates random URL)"
echo "  2) Login first, then deploy (custom subdomain)"
echo "  3) Just open Netlify Drop in browser (drag & drop)"
echo ""
read -p "Enter 1, 2, or 3: " choice

case $choice in
    1)
        echo ""
        echo "Deploying frontend to Netlify..."
        cd frontend
        npm run build
        netlify deploy --prod --dir=dist --message="ARGES frontend deploy"
        ;;
    2)
        echo ""
        echo "Opening Netlify login..."
        netlify login
        echo ""
        echo "Deploying frontend..."
        cd frontend
        npm run build
        netlify deploy --prod --dir=dist --message="ARGES frontend deploy"
        ;;
    3)
        echo ""
        echo "Building frontend..."
        cd frontend
        npm run build
        echo ""
        echo "Done! Drag the 'dist' folder into https://app.netlify.com/drop"
        echo "  Path: $(pwd)/dist"
        start https://app.netlify.com/drop
        ;;
    *)
        echo "Invalid choice."
        exit 1
        ;;
esac

echo ""
echo "============================================"
echo "  Frontend deployed!"
echo "============================================"
echo ""
echo "Your pages:"
echo "  Landing:   https://YOUR-SITE.netlify.app/"
echo "  Login:     https://YOUR-SITE.netlify.app/login"
echo "  Signup:    https://YOUR-SITE.netlify.app/signup"
echo "  Family:    https://YOUR-SITE.netlify.app/family"
echo "  Member:    https://YOUR-SITE.netlify.app/member"
echo "  Helper:    https://YOUR-SITE.netlify.app/helper"
echo "  Admin:     https://YOUR-SITE.netlify.app/admin"
echo "  HowItWorks: https://YOUR-SITE.netlify.app/3d"
echo ""
echo "NOTE: Backend needs separate deployment."
echo "  Deploy backend to Render.com or Railway.app"
echo "  Set VITE_API_URL in Netlify env vars to backend URL"
echo ""
