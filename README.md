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
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Testing**: Jest and React Testing Library
- **Build System**: Webpack with Craco

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
```bash
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
```

## Feature Documentation

For detailed information about specific features, please refer to the following documentation:

- [Credit Application](./docs/features/CREDIT_APPLICATION.md)
- [Risk Assessment](./docs/features/RISK_ASSESSMENT.md)
- [Deal Structuring](./docs/features/DEAL_STRUCTURING.md)
- [Customer Retention](./docs/features/CUSTOMER_RETENTION.md)
- [Document Management](./docs/features/DOCUMENT_MANAGEMENT.md)

## Contributing
Please follow our [coding standards and conventions](./docs/CONTRIBUTING.md) when contributing to this project.

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

This feature enables secure, immutable storage of critical documents with full verification capabilities.

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

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## AI Tools

- **Smart Matching**: AI-powered matching between borrowers and lenders
- **Data Orchestrator**: ETL and data enrichment pipeline
- **Document Verification**: AI-powered document authenticity validation
- **Credit Analysis**: Advanced credit analysis suite
- **Lifecycle Assistant**: AI assistant throughout the deal lifecycle

## Technology Stack

- React.js with hooks for state management
- Tailwind CSS for styling
- Chart.js for data visualization
- REST API integration with backend services

## Development Guidelines

1. Follow component structure conventions
2. Use TypeScript interfaces for type safety
3. Implement responsive design for all components
4. Follow established UI/UX patterns
5. Write comprehensive unit tests

## License

Proprietary software - All rights reserved.

## Project Structure

```
eva-ai-fe/
├── public/             # Static files
├── src/                # Source files
│   ├── components/     # Reusable components
│   │   ├── document/   # Document management components
│   │   ├── risk/       # Risk assessment components
│   │   └── layout/     # Layout components (navbar, sidebar)
│   ├── contexts/       # React context providers
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── api/            # API client functions
│   └── assets/         # Images, fonts, etc.
├── package.json        # Dependencies and scripts
└── tailwind.config.js  # Tailwind CSS configuration
```

## Workflow Stages

The system supports a comprehensive credit origination workflow:

1. **Document Collection**: Gathering and validating required documentation
2. **Risk Assessment**: Analyzing credit risk and financial health
3. **Deal Structuring**: Optimizing deal terms based on risk and requirements
4. **Approval Decision**: Automated and manual approval processes
5. **Document Execution**: Generating and executing transaction documents
6. **Post Closing**: Transaction onboarding and portfolio management

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Acknowledgments

- NVIDIA for Nemotron 70B model architecture
- Tailwind Labs for the CSS framework
- React team for the frontend framework 