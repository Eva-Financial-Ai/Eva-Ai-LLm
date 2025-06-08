#!/bin/bash

# ========================================
# EVA AI Frontend - Cloudflare Secrets Setup
# ========================================

set -e

echo "🔐 Setting up Cloudflare Secrets for EVA AI Platform"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get environment (staging or production)
ENVIRONMENT=${1:-staging}
echo -e "${BLUE}📋 Setting up secrets for: ${ENVIRONMENT}${NC}"

# Verify user is logged into Cloudflare
echo -e "${BLUE}🔑 Verifying Cloudflare authentication...${NC}"
if ! wrangler whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged into Cloudflare. Please run: wrangler login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Cloudflare authentication verified${NC}"

# Function to set secret securely
set_secret() {
    local secret_name=$1
    local description=$2
    
    echo ""
    echo -e "${YELLOW}🔒 Setting up: ${secret_name}${NC}"
    echo -e "${BLUE}📝 Description: ${description}${NC}"
    
    # Check if secret already exists
    if wrangler secret list --env ${ENVIRONMENT} 2>/dev/null | grep -q "$secret_name"; then
        echo -e "${YELLOW}⚠️  Secret '$secret_name' already exists. Do you want to update it? (y/n)${NC}"
        read -r update_secret
        if [[ $update_secret != "y" && $update_secret != "Y" ]]; then
            echo -e "${BLUE}⏭️  Skipping '$secret_name'${NC}"
            return
        fi
    fi
    
    # Set the secret
    wrangler secret put $secret_name --env ${ENVIRONMENT}
}

# Setup all required secrets
echo -e "${BLUE}🔐 Setting up required secrets for financial platform...${NC}"

# Auth0 Configuration
set_secret "AUTH0_CLIENT_SECRET" "Auth0 client secret for user authentication"
set_secret "AUTH0_MANAGEMENT_API_TOKEN" "Auth0 Management API token for user management"

# Financial Services
set_secret "PLAID_SECRET_KEY" "Plaid secret key for bank account linking"
set_secret "PLAID_CLIENT_SECRET" "Plaid client secret for API access"
set_secret "STRIPE_SECRET_KEY" "Stripe secret key for payment processing"
set_secret "STRIPE_WEBHOOK_SECRET" "Stripe webhook secret for event verification"

# Communication
set_secret "TWILIO_AUTH_TOKEN" "Twilio authentication token for SMS/calls"
set_secret "TWILIO_ACCOUNT_SID" "Twilio account SID for API access"

# Encryption and Security
set_secret "ENCRYPTION_KEY" "Master encryption key for sensitive data"
set_secret "JWT_SECRET" "JWT signing secret for session tokens"
set_secret "API_SECRET_KEY" "Internal API secret key"

# Monitoring and Analytics
set_secret "SENTRY_DSN" "Sentry DSN for error monitoring"
set_secret "MIXPANEL_SECRET" "Mixpanel secret for analytics"

# External APIs
set_secret "GEOAPIFY_API_KEY" "Geoapify API key for location services"
set_secret "OPENAI_API_KEY" "OpenAI API key for EVA AI assistant"

# Database and Storage
set_secret "DATABASE_URL" "Database connection URL"
set_secret "REDIS_URL" "Redis connection URL for caching"

echo ""
echo -e "${GREEN}🎉 All secrets have been configured!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Verify all secrets are set correctly:"
echo "   npm run cf:secrets:${ENVIRONMENT}"
echo ""
echo "2. Deploy your application:"
echo "   npm run deploy:cloudflare:${ENVIRONMENT}"
echo ""
echo "3. Test the deployment:"
if [ "$ENVIRONMENT" = "staging" ]; then
    echo "   https://demo.evafi.ai"
else
    echo "   https://app.evafi.ai"
fi
echo ""
echo -e "${GREEN}✅ Secrets setup complete!${NC}" 