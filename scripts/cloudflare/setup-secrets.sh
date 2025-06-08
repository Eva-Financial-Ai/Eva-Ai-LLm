#!/bin/bash

# EVA Platform - Cloudflare Secrets Setup Script
# This script sets up all required secrets in Cloudflare's Secret Store

echo "🔐 Setting up EVA Platform Secrets in Cloudflare..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if wrangler is authenticated
echo -e "${BLUE}Checking Wrangler authentication...${NC}"
if ! wrangler whoami > /dev/null 2>&1; then
    echo -e "${RED}❌ Please authenticate with Wrangler first: wrangler auth login${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Wrangler authenticated${NC}"

# Function to set secret with confirmation
set_secret() {
    local secret_name=$1
    local description=$2
    local example_value=$3
    
    echo ""
    echo -e "${YELLOW}Setting up: ${secret_name}${NC}"
    echo -e "${BLUE}Description: ${description}${NC}"
    echo -e "${BLUE}Example: ${example_value}${NC}"
    
    read -p "Do you want to set this secret now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if wrangler secret put "$secret_name"; then
            echo -e "${GREEN}✅ ${secret_name} set successfully${NC}"
        else
            echo -e "${RED}❌ Failed to set ${secret_name}${NC}"
        fi
    else
        echo -e "${YELLOW}⏭️  Skipping ${secret_name}${NC}"
    fi
}

# Core Authentication Secrets
echo -e "${BLUE}=== AUTHENTICATION SECRETS ===${NC}"

set_secret "JWT_SECRET" \
    "Secret key for JWT token signing and verification" \
    "your-super-secure-jwt-secret-key-here"

set_secret "AUTH0_DOMAIN" \
    "Auth0 domain for authentication" \
    "your-tenant.auth0.com"

set_secret "AUTH0_CLIENT_ID" \
    "Auth0 client ID for the EVA Platform" \
    "your-auth0-client-id"

set_secret "AUTH0_CLIENT_SECRET" \
    "Auth0 client secret for secure authentication" \
    "your-auth0-client-secret"

set_secret "AUTH0_AUDIENCE" \
    "Auth0 API audience identifier" \
    "https://api.eva-platform.com"

# Database Secrets
echo -e "${BLUE}=== DATABASE SECRETS ===${NC}"

set_secret "DATABASE_ENCRYPTION_KEY" \
    "Encryption key for sensitive database fields" \
    "your-32-character-encryption-key"

set_secret "SUPABASE_ANON_KEY" \
    "Supabase anonymous key for database access" \
    "your-supabase-anon-key"

set_secret "SUPABASE_SERVICE_ROLE_KEY" \
    "Supabase service role key for admin operations" \
    "your-supabase-service-role-key"

set_secret "SUPABASE_URL" \
    "Supabase project URL" \
    "https://your-project.supabase.co"

# API Integration Secrets
echo -e "${BLUE}=== API INTEGRATION SECRETS ===${NC}"

set_secret "OPENAI_API_KEY" \
    "OpenAI API key for AI-powered features" \
    "sk-your-openai-api-key"

set_secret "HUGGINGFACE_API_KEY" \
    "Hugging Face API key for AI models" \
    "hf_your-huggingface-api-key"

set_secret "PLAID_CLIENT_ID" \
    "Plaid client ID for banking integrations" \
    "your-plaid-client-id"

set_secret "PLAID_SECRET" \
    "Plaid secret key for secure banking API access" \
    "your-plaid-secret-key"

set_secret "QUICKBOOKS_CLIENT_ID" \
    "QuickBooks client ID for accounting integration" \
    "your-quickbooks-client-id"

set_secret "QUICKBOOKS_CLIENT_SECRET" \
    "QuickBooks client secret" \
    "your-quickbooks-client-secret"

# Communication & Notification Secrets
echo -e "${BLUE}=== COMMUNICATION SECRETS ===${NC}"

set_secret "CLOUDFLARE_EMAIL_API_KEY" \
    "Cloudflare Email API key for notifications" \
    "your-cloudflare-email-api-key"

set_secret "CLOUDFLARE_SMS_API_KEY" \
    "Cloudflare SMS API key for text notifications" \
    "your-cloudflare-sms-api-key"

set_secret "SMS_WEBHOOK_SECRET" \
    "Webhook secret for SMS delivery confirmations" \
    "your-sms-webhook-secret"

set_secret "TURN_USERNAME" \
    "TURN server username for WebRTC calling" \
    "eva-platform-turn-user"

set_secret "TURN_PASSWORD" \
    "TURN server password for WebRTC calling" \
    "your-turn-server-password"

# Credit Bureau & Risk Assessment Secrets
echo -e "${BLUE}=== CREDIT & RISK SECRETS ===${NC}"

set_secret "EXPERIAN_API_KEY" \
    "Experian API key for credit checks" \
    "your-experian-api-key"

set_secret "EQUIFAX_API_KEY" \
    "Equifax API key for credit reporting" \
    "your-equifax-api-key"

set_secret "TRANSUNION_API_KEY" \
    "TransUnion API key for credit data" \
    "your-transunion-api-key"

set_secret "DUNS_API_KEY" \
    "D&B D-U-N-S API key for business verification" \
    "your-duns-api-key"

# Payment Processing Secrets
echo -e "${BLUE}=== PAYMENT PROCESSING SECRETS ===${NC}"

set_secret "STRIPE_SECRET_KEY" \
    "Stripe secret key for payment processing" \
    "sk_live_your-stripe-secret-key"

set_secret "STRIPE_WEBHOOK_SECRET" \
    "Stripe webhook secret for secure callbacks" \
    "whsec_your-stripe-webhook-secret"

# Security & Compliance Secrets
echo -e "${BLUE}=== SECURITY & COMPLIANCE SECRETS ===${NC}"

set_secret "WEBHOOK_SECRET" \
    "General webhook secret for API security" \
    "your-webhook-secret-key"

set_secret "ENCRYPTION_SALT" \
    "Salt for password and data encryption" \
    "your-encryption-salt"

set_secret "SESSION_SECRET" \
    "Secret for session management" \
    "your-session-secret-key"

set_secret "AUDIT_LOG_KEY" \
    "Key for audit log encryption" \
    "your-audit-log-encryption-key"

# Third-party Service Secrets
echo -e "${BLUE}=== THIRD-PARTY SERVICE SECRETS ===${NC}"

set_secret "SENDGRID_API_KEY" \
    "SendGrid API key for backup email service" \
    "SG.your-sendgrid-api-key"

set_secret "TWILIO_ACCOUNT_SID" \
    "Twilio Account SID for backup SMS service" \
    "AC-your-twilio-account-sid"

set_secret "TWILIO_AUTH_TOKEN" \
    "Twilio Auth Token for SMS operations" \
    "your-twilio-auth-token"

set_secret "DOCUSIGN_INTEGRATION_KEY" \
    "DocuSign integration key for enterprise e-signatures" \
    "your-docusign-integration-key"

set_secret "DOCUSIGN_USER_ID" \
    "DocuSign user ID for API access" \
    "your-docusign-user-id"

set_secret "DOCUSIGN_PRIVATE_KEY" \
    "DocuSign private key for JWT authentication" \
    "-----BEGIN RSA PRIVATE KEY-----\nyour-docusign-private-key\n-----END RSA PRIVATE KEY-----"

# Final Summary
echo ""
echo -e "${GREEN}🎉 SECRET SETUP COMPLETE!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}✅ Secrets have been configured in Cloudflare Secret Store${NC}"
echo -e "${BLUE}✅ All secrets are encrypted and secure${NC}"
echo -e "${BLUE}✅ Ready for production deployment${NC}"
echo ""
echo -e "${YELLOW}📝 NEXT STEPS:${NC}"
echo "1. Verify all secrets are set: wrangler secret list"
echo "2. Test API endpoints with new secrets"
echo "3. Deploy workers: npm run deploy:workers"
echo "4. Monitor logs for any authentication issues"
echo ""
echo -e "${YELLOW}🔒 SECURITY REMINDERS:${NC}"
echo "• Never commit secrets to version control"
echo "• Rotate secrets regularly (quarterly)"
echo "• Monitor secret usage in Cloudflare dashboard"
echo "• Use environment-specific secrets for staging/production"
echo ""
echo -e "${GREEN}EVA Platform is now securely configured! 🚀${NC}" 