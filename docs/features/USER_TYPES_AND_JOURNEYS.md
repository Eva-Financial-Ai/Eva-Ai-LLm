# EVA Platform User Types and Journeys

This document outlines the user stories and journey maps for each user type and specific role within the EVA Financial Platform. These serve as a foundation for understanding user needs, developing features, and refining the user experience.

## Table of Contents

1. [Core EVA Staff Roles](#core-eva-staff-roles)
   - [Sales & Relationship Manager](#sales--relationship-manager)
   - [Loan Processor](#loan-processor)
   - [Credit Underwriter & Analyst](#credit-underwriter--analyst)
   - [Credit Committee](#credit-committee)
   - [Portfolio Manager](#portfolio-manager)
   - [Portfolio Navigator Servicer](#portfolio-navigator-servicer)
   - [Portfolio Navigator Monitoring](#portfolio-navigator-monitoring)

2. [External User Types](#external-user-types)
   - [Lender](#lender)
   - [Broker](#broker)
   - [Borrower](#borrower)
   - [Vendor](#vendor)

3. [Administrative Roles](#administrative-roles)
   - [Developer](#developer)
   - [System Root Admin](#system-root-admin)

---

## Core EVA Staff Roles

### Sales & Relationship Manager

#### User Story
**As a** Sales & Relationship Manager, **I want to** effectively track and manage client relationships, monitor application statuses, and identify new business opportunities **so that** I can meet origination targets while maintaining high client satisfaction.

#### User Journey

1. **Login & Dashboard Review**: Log into EVA platform and view the Sales Manager Dashboard with key metrics (applications, conversions, target progress).
2. **Pipeline Assessment**: Review current pipeline with status distribution, pending actions, and weekly application volume.
3. **Team Management**: Access the Team Members panel to check team performance, assign new applications to team members, and add new team members when needed.
4. **Client Interaction**: Schedule client meetings, document discussions, and follow up on pending items through the communications module.
5. **Lead Management**: Qualify new leads, input their information, and track conversion through various pipeline stages.
6. **Application Creation**: Create new origination applications for qualified clients, input initial information, and invite clients to complete remaining sections.
7. **Status Monitoring**: Track applications through different processing stages, addressing any bottlenecks or delays.
8. **Issue Resolution**: Identify and address client concerns or application issues by coordinating with relevant internal departments.
9. **Performance Analysis**: Review personal and team performance metrics against targets, adjusting strategies as needed.
10. **Reporting**: Generate reports on sales activities, pipeline health, and forecasted closings for management review.

---

### Loan Processor

#### User Story
**As a** Loan Processor, **I want to** efficiently manage application documentation, verify information accuracy, and ensure application completeness **so that** I can prepare clean files for underwriting review while providing excellent customer service.

#### User Journey

1. **Queue Management**: Log in and review assigned processing queue with prioritized applications.
2. **Document Review**: Check each application for required documentation completeness.
3. **Missing Document Management**: Identify missing documents and send automated requests to borrowers/brokers.
4. **Document Verification**: Use document verification features to validate authenticity and extract key information.
5. **Data Entry & Verification**: Ensure all application fields are complete and accurate, cross-referencing with supporting documentation.
6. **Team Collaboration**: Assign tasks to team members and track completion through the processor dashboard.
7. **Application Preparation**: Compile completed applications with all supporting documents for underwriting review.
8. **Client Communication**: Respond to client inquiries about documentation requirements and application status.
9. **Compliance Checks**: Perform initial compliance checks on applications before routing to underwriting.
10. **Handoff to Underwriting**: Transfer completed applications to the underwriting queue with summary notes.

---

### Credit Underwriter & Analyst

#### User Story
**As a** Credit Underwriter & Analyst, **I want to** thoroughly evaluate loan applications using financial data, risk models, and industry benchmarks **so that** I can make informed credit decisions that balance portfolio growth with risk management.

#### User Journey

1. **Application Review**: Access the underwriting queue and select applications for review.
2. **Document Analysis**: Review all provided financial documents using the Document Verification AI.
3. **Financial Analysis**: Analyze key financial indicators, cash flow, liquidity, and leverage metrics.
4. **Risk Assessment**: Use the Risk Map Navigator to evaluate application against risk parameters.
5. **Credit Scoring**: Generate and review credit scores based on various risk factors.
6. **Industry Benchmarking**: Compare applicant metrics against industry benchmarks.
7. **Team Management**: Delegate specific analysis tasks to team members as needed.
8. **Additional Information Requests**: Request additional information or clarification when needed.
9. **Structuring Recommendations**: Develop appropriate loan structure based on risk assessment.
10. **Credit Decision**: Make credit recommendation (approve, decline, or approve with conditions).
11. **Presentation Preparation**: Prepare presentation of analysis for credit committee review.
12. **Communication**: Communicate decisions and conditions to relationship managers.

---

### Credit Committee

#### User Story
**As a** Credit Committee member, **I want to** review underwritten loan applications, assess risk profiles, and make final credit decisions **so that** I can maintain portfolio quality while meeting business growth objectives.

#### User Journey

1. **Meeting Preparation**: Review upcoming applications scheduled for committee review.
2. **Application Evaluation**: Assess underwriter recommendations and supporting documentation.
3. **Risk Discussion**: Discuss risk factors, mitigants, and policy considerations with committee members.
4. **Exception Analysis**: Evaluate any policy exceptions requested and their justifications.
5. **Portfolio Impact Assessment**: Consider how the application impacts overall portfolio risk metrics.
6. **Deal Structuring Review**: Review and potentially modify proposed deal structures.
7. **Decision Making**: Collaborate with committee to reach consensus on approval decision.
8. **Condition Setting**: Establish any conditions required for approval.
9. **Decision Documentation**: Record decision rationale and conditions in the system.
10. **Performance Monitoring**: Review performance of previously approved loans against projections.

---

### Portfolio Manager

#### User Story
**As a** Portfolio Manager, **I want to** monitor portfolio performance, manage client relationships post-closing, and identify opportunities for additional services **so that** I can maximize portfolio returns while maintaining strong client satisfaction.

#### User Journey

1. **Portfolio Dashboard**: Review portfolio health metrics including exposure, performance, and risk indicators.
2. **Account Review**: Conduct regular reviews of specific accounts to assess performance.
3. **Team Assignment**: Manage team members who handle different segments of the portfolio.
4. **Covenant Monitoring**: Track compliance with loan covenants and take action on exceptions.
5. **Client Relationship Management**: Schedule and conduct regular client check-ins.
6. **Early Warning Identification**: Identify accounts showing early signs of distress.
7. **Action Plan Development**: Create and implement action plans for at-risk accounts.
8. **Cross-Sell Opportunity**: Identify clients with needs for additional financial products.
9. **Portfolio Reporting**: Generate comprehensive reports on portfolio performance.
10. **Strategy Adjustment**: Adjust portfolio strategy based on economic conditions and performance trends.

---

### Portfolio Navigator Servicer

#### User Story
**As a** Portfolio Navigator Servicer, **I want to** efficiently manage loan servicing operations, payment processing, and account maintenance **so that** I can ensure accurate and timely loan administration while providing excellent customer service.

#### User Journey

1. **Daily Processing**: Review and process daily payment transactions from various channels.
2. **Payment Application**: Apply payments correctly to principal, interest, fees, and escrows.
3. **Team Management**: Assign and monitor team member tasks and performance.
4. **Exception Handling**: Resolve payment exceptions, returned items, or processing errors.
5. **Client Inquiries**: Respond to borrower questions about payments, statements, or account status.
6. **Statement Generation**: Prepare and distribute regular account statements to borrowers.
7. **Escrow Management**: Analyze escrow accounts and make disbursements as required.
8. **System Maintenance**: Ensure loan servicing system data integrity and accuracy.
9. **Process Improvement**: Identify and implement servicing process improvements.
10. **Compliance Adherence**: Ensure all servicing activities comply with regulatory requirements.

---

### Portfolio Navigator Monitoring

#### User Story
**As a** Portfolio Navigator Monitoring specialist, **I want to** continuously monitor portfolio risk indicators, covenant compliance, and industry trends **so that** I can proactively identify emerging risks and provide early intervention recommendations.

#### User Journey

1. **Risk Dashboard**: Review key portfolio risk metrics and flagged accounts.
2. **Financial Statement Analysis**: Review and analyze periodic financial statements from borrowers.
3. **Team Collaboration**: Assign accounts to team members for detailed review.
4. **Covenant Compliance**: Verify compliance with financial and operational covenants.
5. **Industry Analysis**: Monitor industry-specific trends affecting borrower segments.
6. **Risk Rating Review**: Conduct regular risk rating reviews of portfolio accounts.
7. **Early Intervention**: Develop intervention strategies for accounts showing early warning signs.
8. **Reporting**: Generate comprehensive risk reports for management review.
9. **Communication**: Communicate findings to relationship managers and portfolio managers.
10. **Policy Recommendations**: Suggest adjustments to risk policies based on observed trends.

---

## External User Types

### Lender

#### User Story
**As a** Lender, **I want to** efficiently evaluate loan opportunities, manage my lending pipeline, and administer my loan portfolio **so that** I can grow my lending business profitably while managing risk effectively.

#### User Journey - Standard User

1. **Dashboard Review**: Log in and review lender dashboard showing applications, pipeline, and portfolio metrics.
2. **Application Screening**: Review new applications matched to lending criteria.
3. **Document Collection**: Gather and review required documentation from applicants.
4. **Risk Assessment**: Evaluate application risk using integrated risk assessment tools.
5. **Deal Structuring**: Structure financing terms appropriate to the risk profile.
6. **Approval Process**: Route applications through internal approval workflow.
7. **Team Management**: Manage lending team members with different roles and permissions.
8. **Document Generation**: Generate loan documents for approved applications.
9. **Closing Coordination**: Coordinate closing process with all relevant parties.
10. **Portfolio Management**: Monitor closed loans for performance and compliance.

#### User Journey - CPA/Bookkeeper

1. **Limited Access Login**: Access platform with restricted permissions focused on financial verification.
2. **Financial Review**: Review borrower-provided financial statements for accuracy.
3. **Document Verification**: Verify tax returns and other financial documentation.
4. **Financial Analysis**: Provide financial analysis to support lending decisions.
5. **Compliance Verification**: Verify financial compliance with loan covenants.
6. **Report Generation**: Generate financial analysis reports for lender review.
7. **Query Response**: Respond to specific financial queries from the lending team.
8. **Statement Preparation**: Assist in preparing financial statements for loan applications.
9. **Document Organization**: Organize and properly file financial documentation.
10. **Communication**: Communicate financial findings to the lender team.

---

### Broker

#### User Story
**As a** Broker, **I want to** efficiently match borrowers with appropriate lenders, manage the application process, and track deals through to closing **so that** I can maximize successful placements and commissions while providing valuable service to my clients.

#### User Journey - Standard User

1. **Dashboard Review**: Log in and view broker dashboard with client applications, pipeline, and commission tracking.
2. **Client Onboarding**: Input new client information and financing needs.
3. **Lender Matching**: Use Smart Matching to identify appropriate lenders for client needs.
4. **Application Preparation**: Assist clients in preparing loan applications.
5. **Document Collection**: Gather required documentation from clients.
6. **Application Submission**: Submit completed applications to selected lenders.
7. **Status Tracking**: Monitor application status through the approval process.
8. **Team Management**: Manage broker team members with appropriate permissions.
9. **Client Communication**: Keep clients informed about application progress.
10. **Commission Tracking**: Track and manage commission receipts for closed deals.

#### User Journey - CPA/Bookkeeper

1. **Limited Access Login**: Access platform with focused permissions for financial support.
2. **Financial Preparation**: Help prepare financial statements for loan applications.
3. **Document Verification**: Verify financial documentation accuracy.
4. **Application Support**: Provide financial inputs for application completion.
5. **Query Response**: Answer lender financial queries on behalf of clients.
6. **Documentation Organization**: Organize financial documentation packages.
7. **Financial Analysis**: Provide financial analysis to support applications.
8. **Compliance Support**: Ensure financial documentation meets lender requirements.
9. **Record Keeping**: Maintain accurate financial records for transaction history.
10. **Client Guidance**: Guide clients on financial documentation requirements.

---

### Borrower

#### User Story
**As a** Borrower, **I want to** easily apply for financing, track my application progress, and manage my loans **so that** I can efficiently access capital for my business needs while maintaining clear visibility into my obligations.

#### User Journey - Owners

1. **Account Registration**: Register for a borrower account with business information.
2. **Dashboard Review**: View borrower dashboard showing applications, active loans, and payment information.
3. **Financing Application**: Complete new financing application with business details.
4. **Document Upload**: Upload required business and financial documentation.
5. **Team Management**: Add and manage team members who can access the account.
6. **Application Tracking**: Monitor application status through the approval process.
7. **Communication**: Communicate with lenders and respond to information requests.
8. **Offer Review**: Review and accept financing offers from lenders.
9. **Document Signing**: Electronically sign loan documents.
10. **Loan Management**: Access loan details, payment history, and upcoming obligations.

#### User Journey - Employees

1. **Limited Access Login**: Access platform with permissions granted by owners.
2. **Application Assistance**: Help complete sections of financing applications.
3. **Document Preparation**: Prepare documents requested by lenders.
4. **Information Gathering**: Collect required information from various departments.
5. **Status Checking**: Check application status without modification rights.
6. **Basic Communication**: Engage in basic communication with lenders under supervision.
7. **Document Organization**: Organize company documents needed for applications.
8. **Data Entry**: Complete routine data entry for applications.
9. **Report Access**: Access basic reports on active loans and applications.
10. **Task Management**: Track assigned tasks related to financing process.

#### User Journey - CPA/Bookkeeper

1. **Financial Access Login**: Log in with permissions focused on financial aspects.
2. **Financial Preparation**: Prepare financial statements for loan applications.
3. **Financial Documentation**: Upload and manage financial documentation.
4. **Financial Verification**: Verify financial information in applications.
5. **Query Response**: Respond to lender queries about financial details.
6. **Financial Compliance**: Ensure ongoing financial compliance with loan terms.
7. **Financial Reporting**: Generate financial reports required by lenders.
8. **Statement Reconciliation**: Reconcile loan statements with financial records.
9. **Financial Planning**: Provide financial inputs for future funding needs.
10. **Payment Verification**: Verify loan payment accuracy and recording.

#### User Journey - Authorized Proxy

1. **Delegated Access Login**: Access platform with specific delegated authorities.
2. **Application Completion**: Complete loan applications on behalf of owners.
3. **Document Submission**: Submit required documentation to lenders.
4. **Communication Management**: Manage communications with lenders.
5. **Decision Coordination**: Coordinate financing decisions with business owners.
6. **Status Reporting**: Report application status to business owners.
7. **Document Signing**: Sign documents with delegated signing authority.
8. **Information Verification**: Verify business information with appropriate parties.
9. **Task Coordination**: Coordinate tasks among different business stakeholders.
10. **Process Management**: Manage the overall financing process on owners' behalf.

---

### Vendor

#### User Story
**As a** Vendor, **I want to** offer financing options to my customers, track financing applications, and manage my equipment inventory **so that** I can increase sales volume while providing valuable financing solutions to my customers.

#### User Journey - Business Owner

1. **Account Setup**: Register and set up vendor business profile.
2. **Dashboard Review**: View vendor dashboard with financing applications, equipment inventory, and team management.
3. **Customer Financing**: Initiate financing applications for customers.
4. **Equipment Catalog**: Manage equipment catalog with financing options.
5. **Team Management**: Add and manage team members with appropriate roles.
6. **Application Tracking**: Monitor customer financing applications through approval process.
7. **Lender Relationships**: Manage relationships with partner lenders.
8. **Performance Analytics**: Review financing program performance metrics.
9. **Strategy Adjustment**: Adjust financing offers based on performance data.
10. **Business Expansion**: Explore new financing partnerships and programs.

#### User Journey - Finance Department & Titling

1. **Financial Access Login**: Log in with finance-specific permissions.
2. **Financing Program Management**: Manage details of financing programs offered.
3. **Application Processing**: Process financing applications on the financial side.
4. **Document Preparation**: Prepare financial documentation for transactions.
5. **Title Management**: Manage equipment titles through financing process.
6. **Payment Processing**: Process customer payments and lender disbursements.
7. **Financial Reporting**: Generate reports on financing program performance.
8. **Contract Management**: Manage financing contracts and terms.
9. **Compliance Monitoring**: Ensure compliance with financing regulations.
10. **Financial Integration**: Integrate financing data with accounting systems.

#### User Journey - Sales Department

1. **Sales Portal Access**: Log in with sales-focused permissions.
2. **Customer Financing Offers**: Present financing options to customers.
3. **Application Initiation**: Help customers start financing applications.
4. **Deal Structuring**: Structure equipment deals with financing components.
5. **Status Tracking**: Track customer financing applications.
6. **Commission Tracking**: Monitor commissions from financed sales.
7. **Customer Communication**: Communicate with customers about financing.
8. **Sales Reporting**: Generate reports on financing-enabled sales.
9. **Lead Management**: Manage leads with financing needs.
10. **Sales Strategy**: Develop sales strategies leveraging financing options.

#### User Journey - Marketing

1. **Marketing Portal Access**: Log in with marketing-specific permissions.
2. **Financing Program Promotion**: Develop marketing materials for financing programs.
3. **Campaign Management**: Create campaigns highlighting financing options.
4. **Customer Targeting**: Target potential customers for specific financing programs.
5. **Performance Analytics**: Analyze performance of financing-related marketing.
6. **Content Development**: Develop educational content about financing options.
7. **Channel Management**: Manage marketing channels for financing programs.
8. **Feedback Collection**: Collect customer feedback on financing experience.
9. **Competitive Analysis**: Monitor competitor financing offerings.
10. **Brand Integration**: Ensure financing promotions align with brand strategy.

#### User Journey - Maintenance and Service

1. **Service Portal Access**: Log in with service-oriented permissions.
2. **Equipment Records**: Access equipment records under financing.
3. **Service History**: Track service history on financed equipment.
4. **Warranty Management**: Manage warranties on financed equipment.
5. **Service Scheduling**: Schedule service for financed equipment.
6. **Documentation**: Document service performed on financed equipment.
7. **Customer Communication**: Communicate with customers about service needs.
8. **Parts Ordering**: Order parts for financed equipment.
9. **Service Reporting**: Generate reports on serviced financed equipment.
10. **Maintenance Planning**: Plan maintenance schedules for financed equipment.

#### User Journey - Managers

1. **Management Portal Access**: Log in with comprehensive management permissions.
2. **Team Oversight**: Manage all team members across departments.
3. **Performance Review**: Review performance metrics across all areas.
4. **Strategic Planning**: Develop strategies for financing program growth.
5. **Partner Relationship Management**: Manage relationships with financing partners.
6. **Program Development**: Develop new financing program offerings.
7. **Problem Resolution**: Address escalated issues with financing applications.
8. **Resource Allocation**: Allocate resources across different departments.
9. **Policy Development**: Develop and implement financing policies.
10. **Business Intelligence**: Analyze comprehensive data for business decisions.

---

## Administrative Roles

### Developer

#### User Story
**As a** Developer, **I want to** access development tools, test environments, and API documentation **so that** I can efficiently build, test, and integrate with the platform while ensuring technical quality.

#### User Journey

1. **Developer Portal Access**: Log in to developer portal with technical privileges.
2. **Environment Selection**: Select appropriate development/testing environment.
3. **API Documentation**: Browse comprehensive API documentation.
4. **Test Data Generation**: Generate test data for development purposes.
5. **Integration Testing**: Test integration points with external systems.
6. **Bug Tracking**: Report and track bugs in the system.
7. **Feature Development**: Develop new features in isolated environments.
8. **Code Review**: Participate in code review processes.
9. **Deployment Management**: Manage feature deployments across environments.
10. **Performance Monitoring**: Monitor system performance and optimize as needed.

---

### System Root Admin

#### User Story
**As a** System Root Admin, **I want to** manage system configuration, user access, and security settings **so that** I can maintain platform integrity, security, and optimal performance.

#### User Journey

1. **Admin Portal Access**: Log in with highest-level system privileges.
2. **User Management**: Manage user accounts, roles, and permissions.
3. **System Configuration**: Configure system-wide settings and parameters.
4. **Security Monitoring**: Monitor security logs and address potential issues.
5. **Backup Management**: Ensure data backup processes are functioning correctly.
6. **System Updates**: Plan and implement system updates and patches.
7. **Performance Tuning**: Optimize system performance based on metrics.
8. **Disaster Recovery**: Test and maintain disaster recovery procedures.
9. **Compliance Management**: Ensure system meets regulatory requirements.
10. **Vendor Management**: Manage relationships with technology vendors.

---

## Implementation Considerations

When implementing features based on these user stories and journeys:

1. **Role-Based Access Control**: Carefully implement permissions based on user types and roles.
2. **Progressive Complexity**: Reveal functionality complexity proportional to user role sophistication.
3. **Context Awareness**: Provide interfaces tailored to specific user contexts and needs.
4. **Workflow Integration**: Ensure seamless transitions between different user roles in shared workflows.
5. **Data Security**: Implement appropriate data access controls for different user types.
6. **Scalability**: Design interfaces that scale from individual users to team management.
7. **Cross-Role Collaboration**: Enable efficient collaboration between different user types.
8. **Audit Trails**: Maintain comprehensive audit trails for all user actions.
9. **Feedback Loops**: Create mechanisms to gather user feedback for continual improvement.
10. **Adaptive Interfaces**: Allow interface customization based on user preferences and patterns.

---

*This document serves as a living reference for understanding the diverse user needs across the EVA platform. It should be updated regularly as user needs evolve and new roles are introduced.* 