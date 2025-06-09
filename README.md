# EVA Platform Frontend

An advanced AI-powered credit origination platform frontend providing a comprehensive interface for borrowers, lenders, brokers, and vendors to manage the entire loan origination lifecycle.

![EVA Platform](public/icons/eva-avatar.svg)

## 🌟 Key Features

### 🏠 Dashboard
Role-specific dashboards with personalized views for:
- **Borrowers**: Track applications, documents, and loan status
- **Lenders**: Monitor pipelines, portfolio analytics, and risk assessments
- **Brokers**: Analyze deal flow, performance metrics, and commission forecasts
- **Vendors**: Equipment financing and client relationship management

### 📝 Credit Application
Comprehensive application management with:
- Multi-stage business & owner information collection
- Flexible financing instrument support
- Secure document upload with AI-powered verification
- Database-powered pre-fill capabilities
- Digital signature integration

### 🤝 Customer Retention
Enhanced relationship management tools:
- Customer contact management with multi-dimensional filtering
- Commitment tracking and follow-up automation
- Performance analytics and reporting dashboards
- Calendar integration for appointment scheduling

### 📊 Risk Assessment
Sophisticated risk analysis powered by AI:
- **ModularRiskNavigator**: Advanced visualization of risk factors
- Risk scoring and automated underwriting
- Compliance verification with regulatory frameworks
- Risk category breakdown with detailed metrics

### 💼 Deal Structuring
Smart tools for optimizing loan structures:
- Covenant configuration and management
- AI-powered term sheet generation
- Pricing optimization based on risk profiles

### 📄 Transaction Execution
End-to-end document workflow:
- E-signature integration with multiple providers
- Document status tracking and notifications
- Comprehensive closing checklist management

### 🔒 Filelock Drive
Blockchain-enhanced secure document storage:
- Sophisticated role-based access control
- Shield Network blockchain verification
- Document versioning with immutable history

### 📋 Safe Forms
AI-enhanced document generation:
- Template management for common financial documents
- Dynamic form generation based on application type
- Compliance-focused document creation

## 🛠️ Technology Stack

- **Framework**: React.js 18 with functional components and hooks
- **State Management**: React Context API and custom hooks
- **Styling**: Tailwind CSS with custom design system
- **API**: Axios with RESTful endpoints and request interceptors
- **Authentication**: JWT with secure token rotation
- **Testing**: Jest and React Testing Library
- **Build System**: Webpack with Craco configuration
- **AI Integration**: NVIDIA Nemotron 70B model (EVA)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.14.0 or higher)
- npm (v8.3.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/financeaiguy/evafi-ai-fe-demo.git
cd evafi-ai-fe-demo

# Install dependencies
npm install

# Fix dependencies (if needed)
./fix-dependencies.sh

# Start development server
npm run dev
```

### Environment Configuration
Create a `.env.local` file with the following minimum configuration:
```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_AUTH_URL=http://localhost:8080/auth
REACT_APP_ENABLE_MOCKS=true
```

For production deployment, use:
```
REACT_APP_API_URL=https://api.evafi.com/api
REACT_APP_AUTH_URL=https://api.evafi.com/auth
REACT_APP_ENABLE_MOCKS=false
```

## 📖 Development Resources

### API Documentation
API schemas available in the `docs/api-schemas` directory. These are auto-generated from the backend repository.

### Component Documentation
Component-specific documentation:
- [Risk Assessment](./src/components/risk/README.md)
- [Deal Structuring](./src/components/deal/README.md)
- [Document Management](./src/components/document/README.md)
- [Blockchain Integration](./src/components/blockchain/README.md)
- [Customer Retention](./src/components/customerRetention/README.md)
- [Communications](./src/components/communications/README.md)

## 🧪 Quality Assurance

### Smart ESLint Solution
Three tiered enforcement levels to fit your development context:
- **Basic Mode**: Critical errors only (`npm run lint:critical`)
- **Moderate Mode**: Critical errors + important warnings (`npm run lint`)
- **Strict Mode**: Full linting with all rules (`npm run lint:strict`)

### Testing Strategy
- Unit tests with Jest and React Testing Library
- Integration tests for critical user flows
- E2E testing with Cypress
- A11y testing with axe-core

### Performance Optimization
See the [Performance Guide](./PERFORMANCE-GUIDE.md) for tips on optimizing frontend performance.

## 🆕 Recent Features & Improvements

### Contact Management System
- New **ContactTypeFilter** component for multi-dimensional filtering
- Enhanced contact views with relationship tracking
- Calendar integration for appointment scheduling
- Communication logging and follow-up management

### ModularRiskNavigator Enhancements
- Fixed duplicate declarations
- Integrated PaywallModal for premium risk reports
- Added support for equipment and real estate loan types
- Enhanced risk visualization with detailed category breakdown

### Unified Chat Interface
The platform features a unified chat interface with three specialized modes:
- **EVA AI Assistant**: General platform assistance
- **Risk Advisor** (red icon): Risk assessment and mitigation suggestions
- **Clear Communications**: Client communication assistance

All chat widgets support drag-and-drop positioning for workflow optimization.

### Shield Network Document Locking
The Filelock Drive now includes enterprise-grade blockchain verification:
- **Document Locking**: Immutable record-keeping on Shield Network Ledger
- **OCR Verification**: AI-powered document content extraction and verification
- **Source Authentication**: Cryptographic origin verification
- **History Tracking**: Tamper-evident document history
- **Fraud Prevention**: Blockchain-verified audit trails

## 👥 User Types & Permissions

### User Hierarchy
1. **Business (Borrowers)**
   - Self-service application management
   - Document uploads and status tracking
   - Limited access to loan-specific data

2. **Vendor**
   - Service request management
   - Document submission and verification
   - Client communication portal

3. **Brokerage**
   - Multi-client application management
   - Advanced deal structuring capabilities
   - Commission tracking and forecasting

4. **Lender**
   - Complete portfolio visibility
   - Underwriting and approval workflows
   - Risk assessment and monitoring tools

### Permission Framework
Granular permissions with progressive access levels:
- **NONE** (0): No access
- **VIEW** (1): Read-only capabilities
- **INTERACT** (2): Basic interaction permissions
- **MODIFY** (3): Edit and update authorization
- **ADMIN** (4): Complete administrative control

Employee role hierarchy within organizations:
- **VIEWER**: Basic read access
- **OPERATOR**: Standard functional access
- **MANAGER**: Enhanced administrative capabilities
- **ADMIN**: Full system control

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

