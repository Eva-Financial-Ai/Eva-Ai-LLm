#!/bin/bash

# =============================================
# EVA Platform Cloudflare Secrets Setup
# =============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ENVIRONMENT=${1:-"development"}

echo -e "${BLUE}🔐 Setting up Cloudflare secrets for ${ENVIRONMENT} environment${NC}"

# Function to generate secure random string
generate_secret() {
    local length=${1:-32}
    openssl rand -base64 $length | tr -d "=+/" | cut -c1-$length
}

# Function to set secret with confirmation
set_secret() {
    local secret_name=$1
    local secret_description=$2
    local default_value=$3
    
    echo -e "${YELLOW}Setting up ${secret_name}${NC}"
    echo -e "${BLUE}Description: ${secret_description}${NC}"
    
    if [ -n "$default_value" ]; then
        echo -e "${GREEN}Using generated value for ${secret_name}${NC}"
        echo "$default_value" | wrangler secret put $secret_name
    else
        echo -e "${YELLOW}Please enter the value for ${secret_name}:${NC}"
        wrangler secret put $secret_name
    fi
    
    echo -e "${GREEN}✅ ${secret_name} configured successfully${NC}"
    echo ""
}

# Check if wrangler is authenticated
echo -e "${YELLOW}📋 Checking Wrangler authentication...${NC}"
if ! wrangler whoami &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with Cloudflare${NC}"
    echo "Please run: wrangler auth login"
    exit 1
fi

echo -e "${GREEN}✅ Wrangler authenticated${NC}"
echo ""

# Generate secure defaults for development
if [ "$ENVIRONMENT" = "development" ]; then
    JWT_SECRET_DEFAULT=$(generate_secret 64)
    ENCRYPTION_KEY_DEFAULT=$(generate_secret 32)
    WEBHOOK_SECRET_DEFAULT=$(generate_secret 32)
else
    JWT_SECRET_DEFAULT=""
    ENCRYPTION_KEY_DEFAULT=""
    WEBHOOK_SECRET_DEFAULT=""
fi

echo -e "${BLUE}🔑 Configuring secrets for ${ENVIRONMENT} environment...${NC}"
echo ""

# Set up all required secrets
set_secret "JWT_SECRET" "Secret key for JWT token signing (64+ characters recommended)" "$JWT_SECRET_DEFAULT"

set_secret "SUPABASE_URL" "Your Supabase project URL (e.g., https://your-project.supabase.co)" ""

set_secret "SUPABASE_ANON_KEY" "Supabase anonymous/public key for client-side operations" ""

set_secret "SUPABASE_SERVICE_ROLE_KEY" "Supabase service role key for server-side operations (keep secure!)" ""

set_secret "HUGGINGFACE_API_KEY" "Hugging Face API key for AI model access (starts with hf_)" ""

set_secret "ENCRYPTION_KEY" "32-byte encryption key for PII data protection" "$ENCRYPTION_KEY_DEFAULT"

set_secret "WEBHOOK_SECRET" "Secret for webhook verification and external integrations" "$WEBHOOK_SECRET_DEFAULT"

echo -e "${GREEN}🎉 All secrets configured successfully!${NC}"
echo ""

# Verify secrets are set
echo -e "${YELLOW}📋 Verifying secrets are configured...${NC}"
echo ""

secrets=(
    "JWT_SECRET"
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "HUGGINGFACE_API_KEY"
    "ENCRYPTION_KEY"
    "WEBHOOK_SECRET"
)

for secret in "${secrets[@]}"; do
    if wrangler secret list | grep -q "$secret"; then
        echo -e "${GREEN}✅ $secret${NC}"
    else
        echo -e "${RED}❌ $secret${NC}"
    fi
done

echo ""
echo -e "${BLUE}🚀 Secrets setup complete for ${ENVIRONMENT} environment!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your .env.${ENVIRONMENT} file with the correct API endpoints"
echo "2. Run the deployment script: ./deploy-eva-platform.sh ${ENVIRONMENT}"
echo "3. Test the deployed services with health checks"
echo ""
echo -e "${BLUE}Security Notes:${NC}"
echo "• Never commit .dev.vars or .env files to version control"
echo "• Rotate secrets regularly in production"
echo "• Use different secrets for each environment"
echo "• Monitor secret usage in Cloudflare dashboard" 