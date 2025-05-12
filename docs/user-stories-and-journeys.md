# Eva Platform User Stories & Journey Maps

This document outlines the user stories and journey maps for the key features of the Eva Financial Platform. These serve as a reference for development prioritization and UX design.

## Document Verification Chat

### User Stories

1. **As a** lender, **I want to** interact with Eva's AI to analyze borrower documents **so that** I can quickly assess risk factors without manual review.

2. **As a** borrower, **I want to** upload my financial documents to an interactive AI **so that** I can understand what information is being extracted and what it means for my application.

3. **As a** broker, **I want to** facilitate document verification via an AI assistant **so that** I can streamline the intake process and focus on client relationships.

4. **As a** compliance officer, **I want to** review AI-extracted document insights **so that** I can ensure regulatory requirements are met without reviewing each document manually.

### User Journey: Lender Using Document Verification

1. **Trigger**: Lender needs to verify financial statements for a new loan application
2. **Entry Point**: Clicks "Document Verification" in the main dashboard
3. **AI Greeting**: Receives welcome message from Eva Financial Model AKA
4. **Initial Question**: Selects or types in a question about borrower creditworthiness
5. **Document Request**: AI requests relevant documents if not already uploaded
6. **Document Upload**: Lender uploads financial statements
7. **Processing Indicator**: Sees AI processing animation while documents are analyzed
8. **AI Analysis**: Receives structured analysis of key financial data points
9. **Follow-up Questions**: Asks clarifying questions about specific metrics
10. **Risk Assessment**: Gets a risk assessment summary from the AI
11. **Action Recommendations**: Receives recommended next steps from AI
12. **Export/Save**: Saves analysis to loan application file
13. **Close**: Closes the chat interface to continue loan processing

## Smart Matching

### User Stories

1. **As a** borrower, **I want to** be matched with lenders most likely to approve my loan **so that** I can avoid wasting time with rejections.

2. **As a** lender, **I want to** see borrowers who meet my lending criteria **so that** I can focus on qualified leads with higher conversion potential.

3. **As a** broker, **I want to** match my clients with appropriate lenders **so that** I can increase my deal success rate.

4. **As a** vendor, **I want to** find businesses that need my equipment solutions **so that** I can expand my customer base with qualified leads.

### User Journey: Borrower Using Smart Matching

1. **Trigger**: Borrower needs financing for equipment purchase
2. **Entry Point**: Navigates to Smart Matching from dashboard
3. **Role Selection**: Confirms borrower role (already selected based on account)
4. **Requirements Input**: Enters financing needs, amount, timeline, business details
5. **Match Processing**: System analyzes criteria against lender database
6. **Match Results**: Views list of matched lenders with compatibility scores
7. **Profile Exploration**: Reviews detailed profiles of top matches
8. **Preferences**: Swipes right on preferred lenders, left on non-preferred
9. **Initial Contact**: Receives notification when matched lender also expresses interest
10. **Communication**: Initiates conversation via platform messaging
11. **Next Steps**: Begins formal application process with selected lender

## Intelligent Data Orchestrator

### User Stories

1. **As a** financial analyst, **I want to** automatically collect and process data from multiple sources **so that** I can create comprehensive financial assessments without manual data entry.

2. **As a** loan officer, **I want to** connect to a borrower's financial systems **so that** I can verify data directly from the source.

3. **As a** borrower, **I want to** securely share my business data **so that** I don't have to manually gather and submit various documents.

4. **As a** credit manager, **I want to** orchestrate data collection across systems **so that** I have a complete financial picture for decisioning.

### User Journey: Loan Officer Using Data Orchestrator

1. **Trigger**: New loan application requires financial verification
2. **Entry Point**: Opens Intelligent Data Orchestrator from loan application
3. **Transaction Association**: System connects orchestrator to loan application ID
4. **Data Requirements**: Reviews required financial information for loan type
5. **Collection Method Selection**: Selects mixture of methods (direct API, document upload)
6. **Connection Configuration**: Configures connections to borrower's accounting system
7. **Authentication**: Completes secure authentication for third-party systems
8. **Data Collection Process**: Monitors real-time data collection progress
9. **Validation Review**: Reviews automatically validated data points
10. **Manual Verification**: Addresses any flagged inconsistencies
11. **Structured Output**: Receives structured financial data integrated into loan application
12. **Confirmation**: Confirms completed data collection for underwriting

## Profile Settings

### User Stories

1. **As a** platform user, **I want to** update my profile information **so that** my contact details and preferences are current.

2. **As a** team administrator, **I want to** manage team member access levels **so that** I can control permissions based on roles.

3. **As a** security-conscious user, **I want to** enable two-factor authentication **so that** my account has enhanced protection.

4. **As a** user with accessibility needs, **I want to** customize interface settings **so that** I can use the platform comfortably.

### User Journey: Team Administrator Managing Team

1. **Trigger**: Need to add new team member to organization account
2. **Entry Point**: Navigates to Profile Settings from account dropdown
3. **Tab Selection**: Selects "Team Management" tab
4. **Current Review**: Reviews current team members and their permissions
5. **Add Member**: Clicks "Add Team Member" button
6. **Information Entry**: Enters new member's name, email, role
7. **Permission Configuration**: Sets specific permissions for platform access
8. **Invitation**: Sends invitation to new team member
9. **Confirmation**: Receives confirmation that invitation was sent
10. **Status Monitoring**: Views pending status until member accepts
11. **Adjustment**: Makes adjustments to permissions as needed after acceptance
12. **Notification Settings**: Configures notification settings for team activities

## Risk Assessment

### User Stories

1. **As a** risk analyst, **I want to** view comprehensive risk metrics **so that** I can make informed lending decisions.

2. **As a** portfolio manager, **I want to** see risk distribution across my loan portfolio **so that** I can maintain balanced risk exposure.

3. **As a** chief credit officer, **I want to** analyze risk trends over time **so that** I can adjust lending criteria proactively.

4. **As a** compliance officer, **I want to** verify risk assessment methodologies **so that** I can ensure regulatory compliance.

### User Journey: Risk Analyst Performing Assessment

1. **Trigger**: New loan application requires risk evaluation
2. **Entry Point**: Opens Risk Assessment module from dashboard
3. **Application Selection**: Selects specific loan application to assess
4. **Data Review**: Reviews financial data pulled from Data Orchestrator
5. **Model Selection**: Selects appropriate risk model for loan type
6. **Analysis Execution**: Runs automated risk analysis
7. **Results Review**: Reviews comprehensive risk metrics and scores
8. **Document Verification**: Opens Document Verification to check specific claims
9. **Risk Factors**: Identifies key risk factors and their impact
10. **Scenario Testing**: Runs scenario analyses with different parameters
11. **Recommendation**: Documents risk assessment and recommendation
12. **Approval Workflow**: Submits assessment to approval workflow

## Deal Structuring

### User Stories

1. **As a** lender, **I want to** create customized loan structures **so that** I can meet borrower needs while managing risk.

2. **As a** borrower, **I want to** see different financing options **so that** I can choose the structure that works best for my business.

3. **As a** broker, **I want to** compare different deal structures **so that** I can present the best options to my client.

4. **As a** credit committee member, **I want to** review proposed structures **so that** I can approve deals that meet our criteria.

### User Journey: Lender Structuring a Deal

1. **Trigger**: Matched borrower has expressed interest in financing
2. **Entry Point**: Opens Deal Structuring from Smart Matching notification
3. **Borrower Profile**: Reviews borrower profile and needs
4. **Risk Assessment**: Reviews automated risk assessment
5. **Term Configuration**: Sets loan term, rate, and amount parameters
6. **Payment Structure**: Configures payment structure and frequency
7. **Covenant Setup**: Adds financial covenants and reporting requirements
8. **Fee Structure**: Defines origination and other fee structures
9. **Document Generation**: Generates term sheet for proposed structure
10. **Internal Approval**: Routes structure for internal approval if needed
11. **Proposal Delivery**: Sends proposal to borrower through platform
12. **Negotiation**: Adjusts terms based on borrower feedback
13. **Finalization**: Finalizes structure to begin documentation phase

---

## Implementation Considerations

When implementing features based on these user stories and journeys:

1. **Progressive Disclosure**: Reveal complexity gradually as users progress through journeys
2. **Error Recovery**: Build clear paths to recover from mistakes at each journey step
3. **Status Visibility**: Always make system status visible during multi-step processes
4. **Contextual Help**: Provide help resources specific to each journey stage
5. **Efficiency for Experts**: Include shortcuts for experienced users
6. **Consistent Patterns**: Maintain consistent interaction patterns across features
7. **Accessibility**: Ensure journeys can be completed using assistive technologies

---

*This document will be regularly updated as user feedback and analytics reveal opportunities for journey optimization.* 