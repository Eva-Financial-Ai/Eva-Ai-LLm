# EVA Platform Frontend

> **NOTE: This project is now RAG-only. All chat and document queries are routed through the `/api/rag-query` and `/api/upload-pdf` endpoints, handled by a Cloudflare Worker. All LLM and legacy chat code has been removed.**

An advanced AI-powered credit origination platform frontend providing a comprehensive interface for borrowers, lenders, brokers, and vendors to manage the entire loan origination lifecycle.

![EVA Platform](public/icons/eva-avatar.svg)

## 🌟 Key Features

- **Role-specific dashboards** for borrowers, lenders, brokers, and vendors
- **Comprehensive credit application** and document management
- **Customer retention tools** and analytics
- **AI-powered risk assessment** and deal structuring
- **Secure document storage** with blockchain verification
- **PDF upload and RAG chat**: All chat and document queries are handled via the RAG Worker endpoints

## 🛠️ Technology Stack

- **Framework**: React.js 18
- **State Management**: React Context API and custom hooks
- **Styling**: Tailwind CSS
- **API**: All API calls use root-relative paths (e.g., `/api/rag-query`)
- **Authentication**: Auth0 (OIDC)
- **Testing**: Jest and React Testing Library
- **Build System**: Webpack with Craco

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.18.0 or higher)
- npm (v8.3.0 or higher)

### Installation
```bash
git clone https://github.com/financeaiguy/evafi-ai-fe-demo.git
cd evafi-ai-fe-demo
npm install
npm run dev
```

### Environment Configuration
Create a `.env.local` or `.env.production` file with:
```
REACT_APP_API_URL=/api
REACT_APP_RAG_API_URL=/api/rag-query
REACT_APP_AUTH_DOMAIN=your-auth0-domain
REACT_APP_AUTH_CLIENT_ID=your-auth0-client-id
REACT_APP_ENVIRONMENT=production
```

## 🛠️ Deployment

### Frontend (Cloudflare Pages)
- Push to the `main` branch for automatic deploys, or use Direct Upload.

### Backend (Cloudflare Worker)
- Deploy with `npx wrangler deploy` from the `cloudflare-worker` directory.
- Set the following secrets in the Worker:
  - `CF_API_TOKEN_LENDER_RAG`
  - `CF_API_TOKEN_EQUIPMENT_RAG`
  - `CF_API_TOKEN_REALESTATE_RAG`
  - `CF_API_TOKEN_SBA_RAG`
  - `CF_API_TOKEN_LENDERLIST_RAG`

### Endpoints
- **RAG Chat**: `/api/rag-query` (POST)
- **PDF Upload**: `/api/upload-pdf` (POST)

## 📖 Documentation

- See `src/api/README.md` for API integration details.
- See `src/components/document/README.md` for PDF upload and RAG indexing flow.

## 🧪 Quality Assurance

- Linting: `npm run lint`
- Unit tests: `npm run test`
- E2E tests: Cypress

## 👥 User Types & Permissions

- **Business (Borrowers)**: Application management, document uploads
- **Vendor**: Service request management, document submission
- **Brokerage**: Deal flow analytics, commission tracking
- **Lender**: Portfolio analytics, risk assessment

---

**All chat and document queries are now handled via the RAG Worker endpoints.  
No direct LLM or legacy chat code remains in this project.**
