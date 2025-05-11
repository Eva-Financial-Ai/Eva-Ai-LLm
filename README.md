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

## ESLint and Code Quality

This project uses ESLint for code quality assurance. We've implemented a flexible, tiered approach to ESLint that lets developers choose the appropriate level of enforcement based on their current task.

### Smart ESLint Solution

Our smart ESLint solution gives you three different enforcement levels:

#### 1. Quick Start: Choose Your ESLint Mode

```bash
# One-command ESLint mode selection
./smart-start.sh normal    # Regular mode with warnings
./smart-start.sh critical  # Only blocks on critical errors
./smart-start.sh off       # No ESLint checking at all
```

#### 2. ESLint Modes Explained

- **Normal Mode**: Standard ESLint configuration with all rules enforced as warnings
- **Critical Mode**: Only enforces rules that would cause runtime errors (like React Hooks rules)
- **Off Mode**: Completely disables ESLint for maximum development speed

#### 3. npm Scripts

You can also use npm scripts directly:

```bash
# Running the app with different ESLint modes
npm start                # Normal mode
npm run start:critical   # Critical-only mode
npm run start:no-lint    # ESLint disabled

# Linting commands
npm run lint             # Check all rules (with warnings)
npm run lint:critical    # Check only critical errors
npm run lint:fix         # Auto-fix issues where possible
npm run lint:strict      # Strict mode - fails on warnings
```

### When to Use Each Mode

- **Normal Mode** (`./smart-start.sh normal`): For regular development when you want to be aware of code quality issues but don't want them blocking your work
- **Critical Mode** (`./smart-start.sh critical`): When focusing on new feature development and only want to be blocked by errors that would crash at runtime
- **Off Mode** (`./smart-start.sh off`): When experimenting, debugging, or in situations where you need maximum speed and will address linting issues later

### Migration Plan

We maintain a detailed migration plan in `ESLINT-MIGRATION-PLAN.md` that outlines:

- Specific issues in each file
- Example fixes for common problems
- Recommended timeline for addressing all linting issues

This approach allows development to continue while we gradually improve code quality by fixing ESLint issues over time.

### Implementation Details

The smart ESLint solution consists of:

- `.eslintrc.local.js`: Base configuration with selective rule enforcement
- `.eslintrc.critical.js`: Configuration that only enforces critical rules
- `eslint-smart.sh`: Script that manages the ESLint setup and mode switching
- `smart-start.sh`: Helper script for running the app with different ESLint modes
- npm scripts in package.json for direct access to different modes

## Linting and ESLint Issues

Some files in this project have ESLint warnings related to React Hooks rules and Testing Library best practices. We're taking a gradual approach to fixing these issues properly rather than ignoring them entirely.

### Immediate Solution

Run the proper ESLint fix script:

```bash
./fix-eslint-properly.sh
```

This script:
1. Configures ESLint to use selective rule overrides (warning instead of error for problematic files)
2. Adds inline ESLint disable comments to specific problem areas
3. Creates a migration plan for properly fixing all issues
4. Adds a strict linting script for validation

### Starting the Development Server

You can run the regular development server:

```bash
npm start
```

### Linting Scripts

- `npm run lint` - Run ESLint with warnings
- `npm run lint:fix` - Run ESLint and try to fix issues automatically
- `npm run lint:strict` - Run ESLint with no warnings allowed (use to validate fixes)

### Migration Plan

See the detailed migration plan in `ESLINT-MIGRATION-PLAN.md` that outlines:
- Specific issues in each file
- Example fixes for common problems
- Timeline for addressing all issues

This approach allows development to continue while we gradually improve code quality. 
## Backend Repository

The backend code has been moved to a separate repository: https://github.com/your-organization/eva-platform-backend

