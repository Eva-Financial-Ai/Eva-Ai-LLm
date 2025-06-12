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

## 🧠 AI Integration

EVA's AI capabilities are powered by NVIDIA Nemotron 70B parameter model fine-tuned for financial services:

- **Smart Matching**: Intelligent pairing of borrowers and lenders
- **Data Orchestration**: Advanced ETL and enrichment pipelines
- **Document Intelligence**: Automated verification and extraction
- **Credit Analysis**: AI-enhanced underwriting and risk assessment
- **Lifecycle Assistant**: Context-aware guidance throughout the process

## 📁 Project Structure

```
eva-platform-frontend/
├── public/             # Static assets
├── docs/               # Documentation and API schemas
├── scripts/            # Build and utility scripts
├── src/
│   ├── api/            # API client functions
│   ├── components/     # Reusable components
│   │   ├── blockchain/ # Blockchain integration
│   │   ├── common/     # Shared UI components
│   │   ├── communications/ # Communication tools
│   │   ├── customerRetention/ # Customer management
│   │   ├── deal/       # Deal structuring
│   │   ├── document/   # Document management
│   │   ├── layout/     # Layout components
│   │   ├── risk/       # Risk assessment
│   │   └── security/   # Security components
│   ├── contexts/       # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── .env.development    # Development environment variables
├── .env.production     # Production environment variables
├── package.json        # Dependencies and scripts
└── tailwind.config.js  # Tailwind CSS configuration
```

## 🔄 Backend Services

The backend services are maintained in a separate repository:
[https://github.com/financeaiguy/evafi-ai-backend](https://github.com/financeaiguy/evafi-ai-backend)

## 👨‍💻 Contributing

Please review our [Contributing Guidelines](./docs/CONTRIBUTING.md) for code standards, branch naming conventions, and pull request procedures.

## 📝 Quality Assurance

Before submitting changes, run through our [QA Checklist](./QA-CHECKLIST.md) to ensure high-quality contributions.

## 📄 License

Proprietary software - All rights reserved.

---

© 2023-2024 EVA Financial Technologies, Inc.

## Design System and Component Library

The EVA Platform uses a standardized design system to ensure consistency across all UI components. The design system defines spacing, typography, colors, and component styles to create a cohesive user experience.

### Design System Documentation

See the full design system documentation in `src/design-system/DesignSystem.md`.

### Core Components

The platform includes the following reusable components:

- **Button**: Standard button with multiple variants (primary, secondary, danger, success, outline) and sizes
- **Card**: Container component for grouping content with various styling options
- **Input**: Form input fields with consistent styling, error states, and accessibility features
- **Modal**: Dialog component with standardized header, content, and action areas
- **FormWrapper**: Wrapper for form content with consistent layout and styling

### Using Components

```jsx
import Button from './components/common/Button';
import Card from './components/common/Card';
import Input from './components/common/Input';
import Modal from './components/common/Modal/Modal';
import { FormWrapper } from './components/common/Form';

// Example usage
function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div>
      <Button 
        variant="primary" 
        onClick={() => setIsModalOpen(true)}
      >
        Open Form
      </Button>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="My Form"
      >
        <FormWrapper
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          submitText="Save"
        >
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          {/* Additional form fields */}
        </FormWrapper>
      </Modal>
    </div>
  );
}
```

### Design Principles

1. **Consistency**: Use the same component for the same purpose throughout the application
2. **Responsiveness**: All components are designed to work across various screen sizes
3. **Accessibility**: Components include proper ARIA attributes and keyboard navigation
4. **Reusability**: Components accept props for customization while maintaining consistent styling

### Styling Guidelines

- Use the Tailwind utility classes defined in our design system
- Maintain consistent spacing using the 8px grid (4px, 8px, 16px, 24px, 32px, etc.)
- Follow the color palette defined in `tailwind.config.js`
- Use proper heading hierarchy (h1, h2, h3) for semantic HTML

## Cloudflare LLM Integration

### Environment Variables

Before deploying or running locally, set the following in your `.env.staging` or `.env.production` files:

```
REACT_APP_CLOUDFLARE_ACCOUNT_ID=eace6f3c56b5735ae4a9ef385d6ee914
REACT_APP_CLOUDFLARE_ZONE_ID=79cbd8176057c91e2e2329ffd8b386a5   # Staging
# REACT_APP_CLOUDFLARE_ZONE_ID=913680b4428f2f4d1c078dd841cd8cdb # Production (uncomment for prod)
REACT_APP_CLOUDFLARE_API_TOKEN=qCC_PYqqlXW6ufNP_SuGW8CrhPoKB9BfFZEPuOiT
REACT_APP_CLOUDFLARE_EMAIL=support@evafi.ai
REACT_APP_SUPPORT_PHONE=7025762013
```

- Only one `REACT_APP_CLOUDFLARE_ZONE_ID` should be active per environment.
- Never commit `.env.*` files with secrets to your repository.

### Sample `.env.staging` file
```
REACT_APP_CLOUDFLARE_ACCOUNT_ID=eace6f3c56b5735ae4a9ef385d6ee914
REACT_APP_CLOUDFLARE_ZONE_ID=79cbd8176057c91e2e2329ffd8b386a5
REACT_APP_CLOUDFLARE_API_TOKEN=qCC_PYqqlXW6ufNP_SuGW8CrhPoKB9BfFZEPuOiT
REACT_APP_CLOUDFLARE_EMAIL=support@evafi.ai
REACT_APP_SUPPORT_PHONE=7025762013
```

### Sample `.env.production` file
```
REACT_APP_CLOUDFLARE_ACCOUNT_ID=eace6f3c56b5735ae4a9ef385d6ee914
REACT_APP_CLOUDFLARE_ZONE_ID=913680b4428f2f4d1c078dd841cd8cdb
REACT_APP_CLOUDFLARE_API_TOKEN=qCC_PYqqlXW6ufNP_SuGW8CrhPoKB9BfFZEPuOiT
REACT_APP_CLOUDFLARE_EMAIL=support@evafi.ai
REACT_APP_SUPPORT_PHONE=7025762013
```

### Security Reminder
- Rotate your API tokens regularly.
- Do NOT commit secrets to version control.
- Change the API token and zone ID as appropriate before releasing to production.

