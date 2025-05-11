# EVA Platform Frontend

This is the frontend for the EVA AI-Powered Credit Origination platform. It provides an interface for borrowers, lenders, brokers, and vendors to manage the loan origination process.

## Features

### Dashboard
The dashboard provides role-specific views for different user types:
- **Borrower Dashboard**: View active applications, loan status, and document requirements
- **Lender Dashboard**: Track deal pipeline, review applications, and analyze portfolio performance
- **Broker Dashboard**: Monitor deal flow, lender performance metrics, and commission forecasts
- **Vendor Dashboard**: Equipment financing tracking and client management

### Credit Application
A comprehensive application form for loan origination with:
- Business & owner information collection
- Support for multiple financing instruments
- Document upload and verification
- Pre-fill from existing borrower database
- Signature and verification

### Customer Retention
Tools to build and maintain relationships with:
- Analytics dashboards for customer insights
- Relationship commitment tracking
- Performance metrics and reporting

### Risk Assessment
Advanced risk analysis tools including:
- Risk Map Navigator for visualizing risk factors
- EVA AI-powered risk analysis
- Compliance verification

### Deal Structuring
Tools for configuring loan terms and conditions:
- Covenant management
- Term sheet generation
- Pricing optimization

### Transaction Execution
Document preparation and signing workflow:
- E-signature integration
- Document status tracking
- Closing checklist

### Filelock Drive
Secure document storage with:
- Role-based access control
- Blockchain verification
- Version control

### Safe Forms
Template-based document generation for:
- Credit applications
- Financial statements
- Compliance documents

## Technology Stack
- **Frontend Framework**: React.js with functional components and hooks
- **State Management**: React Context API and custom hooks
- **Styling**: Tailwind CSS
- **API Communication**: Axios with RESTful endpoints
- **Authentication**: JWT with secure token management
- **Testing**: Jest and React Testing Library
- **Build System**: Webpack with Craco configuration

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-organization/eva-platform-frontend.git
cd eva-platform-frontend

# Install dependencies
npm install

# Fix dependencies (if needed)
./fix-dependencies.sh

# Start development server
npm run dev
```

### Environment Setup
Create a `.env.local` file with the following:
```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_AUTH_URL=http://localhost:8080/auth
REACT_APP_ENABLE_MOCKS=true
```

## Development Resources

### API Documentation
The API documentation is available in the `docs/api-schemas` directory. These schemas are automatically generated from the backend repository.

### Component Documentation
Each major component group has its own README file:
- [Risk Assessment](./src/components/risk/README.md)
- [Deal Structuring](./src/components/deal/README.md)
- [Document Management](./src/components/document/README.md)
- [Blockchain Integration](./src/components/blockchain/README.md)
- [Security](./src/components/security/README.md)
- [Communications](./src/components/communications/README.md)

## Performance Guide

For tips on optimizing the frontend performance, see the [Performance Guide](./PERFORMANCE-GUIDE.md).

## Smart ESLint Solution

Our smart ESLint solution gives you three different enforcement levels:

- **Basic Mode**: Just critical errors (`npm run lint:critical`)
- **Moderate Mode**: Critical errors + important warnings (`npm run lint`)
- **Strict Mode**: Full linting with all rules (`npm run lint:strict`)

Run the appropriate command for your current development context. For setting up the ESLint configuration, see [ESLINT-MIGRATION-PLAN.md](./ESLINT-MIGRATION-PLAN.md).

## New Features

### Unified Chat Interface
The platform now features a unified chat interface with three different modes:
- **EVA AI Assistant** - General platform assistance
- **Risk Advisor** (red icon) - Risk assessment and mitigation suggestions
- **Clear Communications** - Client communication assistance

All chat widgets are movable, allowing users to position them anywhere on the screen for optimal workflow.

### Shield Network Document Locking
The Filelock Drive now includes blockchain verification capabilities:
- **Document Locking** - Lock files on the Shield Network Ledger for immutable record-keeping
- **OCR Verification** - Using DocEasy AI to extract and verify document content
- **Source Authentication** - Verify document origin and authenticity
- **History Tracking** - Analyze document history for potential tampering
- **Fraud Prevention** - Create tamper-proof verification records on blockchain

## User Types and Permissions

The platform supports four distinct user types with varying permission levels:

1. **Business (Borrowers)**
   - Seeking financing
   - Limited access to view their own applications and documents
   - Can interact with basic application workflows

2. **Vendor**
   - Service providers
   - View-only access to relevant service requests
   - Limited access to documents related to their services

3. **Brokerage**
   - Financial intermediaries
   - Advanced access to manage multiple client applications
   - Administrative capabilities for deal structuring

4. **Lender**
   - Financial institutions providing loans
   - Full administrative access to evaluate and process applications
   - Complete view of portfolios and risk assessments

### Permission System

Permissions are implemented using a granular system with multiple levels:
- **NONE** (0): No access
- **VIEW** (1): Read-only access
- **INTERACT** (2): Basic interaction capabilities
- **MODIFY** (3): Ability to change and update
- **ADMIN** (4): Full administrative control

Each feature in the system has a permission level assigned based on user type. The system also supports employee roles within each user type:
- **VIEWER**: Basic viewing permissions
- **OPERATOR**: Standard operational access
- **MANAGER**: Enhanced management capabilities
- **ADMIN**: Full administrative control

## AI Integration

Our platform utilizes advanced AI capabilities powered by NVIDIA Nemotron 70B parameter model fine-tuned as "EVA" for financial use cases:

- **Smart Matching**: AI-powered matching between borrowers and lenders
- **Data Orchestrator**: ETL and data enrichment pipeline
- **Document Verification**: AI-powered document authenticity validation
- **Credit Analysis**: Advanced credit analysis suite
- **Lifecycle Assistant**: AI assistant throughout the deal lifecycle

## Project Structure

```
eva-platform-frontend/
├── public/             # Static files
├── src/                # Source files
│   ├── components/     # Reusable components
│   │   ├── blockchain/ # Blockchain integration components
│   │   ├── document/   # Document management components
│   │   ├── risk/       # Risk assessment components
│   │   └── layout/     # Layout components (navbar, sidebar)
│   ├── contexts/       # React context providers
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── api/            # API client functions
│   └── styles/         # CSS and Tailwind styles
├── docs/               # Documentation
├── scripts/            # Build and utility scripts
├── package.json        # Dependencies and scripts
└── tailwind.config.js  # Tailwind CSS configuration
```

## Backend Repository

The backend services for this application are maintained in a separate repository:
https://github.com/your-organization/eva-platform-backend

## Contributing

Please follow our [coding standards and conventions](./docs/CONTRIBUTING.md) when contributing to this project.

## License

Proprietary software - All rights reserved.

