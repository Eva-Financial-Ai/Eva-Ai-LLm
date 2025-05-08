# Credit Application

## Overview
The Credit Application feature provides a comprehensive digital application process for commercial financing. It enables borrowers to submit financing requests, lenders to review applications, and brokers to manage the application workflow for their clients.

## Key Components

### Application Form
Multi-step application form that collects:

- **Business Information**: Business details, address verification, tax ID
- **Owner Information**: Owner demographics, contact details, ownership percentages
- **Loan Request**: Amount, purpose, financial instrument, term preferences
- **Financial Information**: Revenue, expenses, outstanding debt
- **Banking & Accounting**: Bank account details with Plaid integration
- **Documents & Signature**: Document uploads and e-signature

### Pre-fill Functionality
Allows quick application completion using:

- **Existing Business Data**: Pre-populate fields from database records
- **Search Functionality**: Find businesses by name, tax ID, or other identifiers

### Application Management
Tools for reviewing and processing applications:

- **Status Tracking**: Monitor application progress through the workflow
- **Blockchain Verification**: Optional verification of application data
- **Sharing**: Share application with brokers, lenders, or co-owners

## Usage

### Submitting a New Application
1. Navigate to the Credit Application section
2. Choose between "New Business" or "Existing Business"
3. Complete all required fields across the form tabs
4. Upload necessary documentation
5. Sign and submit the application

### Pre-filling an Application
1. Click "Pre-fill from Existing Borrower"
2. Select the desired business from the database
3. Review pre-filled information for accuracy
4. Complete any missing fields
5. Submit the application

### Sharing an Application
1. After submission, click "Share Application"
2. Enter recipient details (email addresses)
3. Add optional message
4. Set expiration date for the sharing link
5. Recipients receive notification with access to view/complete the application

## Technical Notes
- Address verification uses a third-party service to validate and standardize addresses
- Tax ID validation uses standard EIN format checks
- The application uses browser storage to prevent data loss during form completion 