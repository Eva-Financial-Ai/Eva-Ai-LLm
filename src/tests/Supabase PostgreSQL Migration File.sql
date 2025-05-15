Supabase PostgreSQL Migration File

```sql
-- Supabase PostgreSQL Migration File
-- EVA Platform Database Schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USER MANAGEMENT TABLES

CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login TIMESTAMPTZ,
    account_status TEXT NOT NULL DEFAULT 'pending',
    user_type TEXT NOT NULL DEFAULT 'borrower',
    auth0_id TEXT UNIQUE
);

CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT,
    job_title TEXT,
    address TEXT,
    profile_image_url TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    notification_settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    industry TEXT,
    size INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    subscription_tier TEXT DEFAULT 'free',
    billing_address TEXT,
    main_contact_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE TABLE public.user_organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, organization_id)
);

-- RISK ASSESSMENT SYSTEM TABLES

CREATE TABLE public.risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    borrower_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    broker_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    loan_type TEXT NOT NULL DEFAULT 'unsecured',
    risk_score NUMERIC(5,2),
    industry_avg_score NUMERIC(5,2),
    confidence_score NUMERIC(5,2),
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    report_generated_at TIMESTAMPTZ,
    transaction_id UUID
);

CREATE TABLE public.risk_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    weight_factor NUMERIC(3,2) DEFAULT 1.00
);

CREATE TABLE public.risk_category_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_assessment_id UUID NOT NULL REFERENCES public.risk_assessments(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.risk_categories(id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'yellow',
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(risk_assessment_id, category_id)
);

CREATE TABLE public.risk_findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_assessment_id UUID NOT NULL REFERENCES public.risk_assessments(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    text TEXT NOT NULL,
    category_id UUID REFERENCES public.risk_categories(id) ON DELETE SET NULL,
    priority INTEGER DEFAULT 0,
    recommendation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.risk_map_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

-- TRANSACTION MANAGEMENT TABLES

CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    borrower_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    broker_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    amount NUMERIC(15,2) NOT NULL,
    loan_type TEXT NOT NULL DEFAULT 'unsecured',
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    due_date TIMESTAMPTZ,
    interest_rate NUMERIC(5,2),
    term_length INTEGER,
    term_unit TEXT DEFAULT 'months'
);

-- Add foreign key to risk_assessments after creating transactions table
ALTER TABLE public.risk_assessments ADD CONSTRAINT fk_risk_assessment_transaction 
FOREIGN KEY (transaction_id) REFERENCES public.transactions(id) ON DELETE SET NULL;

CREATE TABLE public.borrowers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT,
    industry TEXT,
    founded_date DATE,
    annual_revenue NUMERIC(15,2),
    employee_count INTEGER,
    business_address TEXT,
    business_phone TEXT,
    tax_id TEXT,
    credit_score INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.brokers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT,
    license_number TEXT,
    commission_rate NUMERIC(5,2) DEFAULT 0,
    performance_rating NUMERIC(3,1),
    regions_served JSONB DEFAULT '[]'::jsonb,
    specialties JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.loan_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    borrower_id UUID NOT NULL REFERENCES public.borrowers(id) ON DELETE CASCADE,
    amount_requested NUMERIC(15,2) NOT NULL,
    purpose TEXT,
    application_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    decision_date TIMESTAMPTZ,
    decision_reason TEXT
);

-- CREDIT AND PAYMENT SYSTEM TABLES

CREATE TABLE public.credit_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    savings_percentage NUMERIC(5,2) DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    credits_available INTEGER NOT NULL DEFAULT 0,
    credits_used INTEGER NOT NULL DEFAULT 0,
    last_purchased_at TIMESTAMPTZ,
    expiration_date TIMESTAMPTZ
);

CREATE TABLE public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    package_id UUID REFERENCES public.credit_packages(id) ON DELETE SET NULL,
    amount NUMERIC(10,2),
    credits INTEGER NOT NULL,
    transaction_type TEXT NOT NULL,
    payment_method TEXT,
    transaction_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    reference_id TEXT
);

CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    reference_number TEXT,
    processor_response JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE public.payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    last_four TEXT,
    expiry_date TEXT,
    bank_name TEXT,
    account_nickname TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- DOCUMENT MANAGEMENT TABLES

CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    upload_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'pending',
    verification_date TIMESTAMPTZ,
    verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE TABLE public.document_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    required_for_loan_types JSONB DEFAULT '[]'::jsonb
);

-- ANALYTICS & REPORTING TABLES

CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_assessment_id UUID NOT NULL REFERENCES public.risk_assessments(id) ON DELETE CASCADE,
    generated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    report_type TEXT NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    file_path TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    view_count INTEGER NOT NULL DEFAULT 0,
    last_accessed_at TIMESTAMPTZ
);

CREATE TABLE public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    session_id TEXT,
    ip_address TEXT,
    user_agent TEXT
);

CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_start TIMESTAMPTZ NOT NULL DEFAULT now(),
    session_end TIMESTAMPTZ,
    duration INTEGER,
    device_info TEXT,
    ip_address TEXT,
    pages_visited JSONB DEFAULT '[]'::jsonb
);

-- COMMUNICATION TABLES

CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    message_type TEXT NOT NULL DEFAULT 'chat',
    content TEXT NOT NULL,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'sent'
);

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at TIMESTAMPTZ,
    is_action_required BOOLEAN DEFAULT false
);

CREATE TABLE public.email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TASK MANAGEMENT TABLES

CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
    assigned_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE public.task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SECURITY & AUDIT TABLES

CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    changes JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    permissions JSONB DEFAULT '[]'::jsonb
);

-- AI AND MACHINE LEARNING TABLES

CREATE TABLE public.ai_analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_assessment_id UUID NOT NULL REFERENCES public.risk_assessments(id) ON DELETE CASCADE,
    model_version TEXT NOT NULL,
    analysis_type TEXT NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL,
    results JSONB DEFAULT '{}'::jsonb,
    processing_time INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.ml_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    description TEXT,
    trained_at TIMESTAMPTZ NOT NULL,
    parameters JSONB DEFAULT '{}'::jsonb,
    performance_metrics JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(name, version)
);

CREATE TABLE public.eva_thought_processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_assessment_id UUID NOT NULL REFERENCES public.risk_assessments(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    thought_text TEXT NOT NULL,
    confidence NUMERIC(5,2),
    next_steps JSONB DEFAULT '[]'::jsonb,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INTEGRATION & CONFIG TABLES

CREATE TABLE public.integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    integration_type TEXT NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'inactive',
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(organization_id, integration_type)
);

CREATE TABLE public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- CREATE INDEXES FOR BETTER PERFORMANCE

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_auth0_id ON public.users(auth0_id);
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_orgs_user_id ON public.user_organizations(user_id);
CREATE INDEX idx_user_orgs_org_id ON public.user_organizations(organization_id);
CREATE INDEX idx_risk_assessments_borrower_id ON public.risk_assessments(borrower_id);
CREATE INDEX idx_risk_assessments_transaction_id ON public.risk_assessments(transaction_id);
CREATE INDEX idx_risk_category_scores_assessment_id ON public.risk_category_scores(risk_assessment_id);
CREATE INDEX idx_risk_findings_assessment_id ON public.risk_findings(risk_assessment_id);
CREATE INDEX idx_transactions_borrower_id ON public.transactions(borrower_id);
CREATE INDEX idx_transactions_broker_id ON public.transactions(broker_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_loan_applications_transaction_id ON public.loan_applications(transaction_id);
CREATE INDEX idx_documents_transaction_id ON public.documents(transaction_id);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_user_credits_user_id ON public.user_credits(user_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_tasks_transaction_id ON public.tasks(transaction_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_id ON public.audit_logs(entity_id);
CREATE INDEX idx_ai_analysis_risk_assessment_id ON public.ai_analysis_results(risk_assessment_id);
CREATE INDEX idx_eva_thought_risk_assessment_id ON public.eva_thought_processes(risk_assessment_id);

-- ROW LEVEL SECURITY POLICIES

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_category_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_map_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrowers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eva_thought_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create an authenticated users role policy for each table
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Add more policies as needed for other tables and access patterns

-- Function for automatically updating the 'updated_at' field
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for tables with updated_at columns
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add similar triggers for other tables with updated_at columns

-- Insert default risk categories
INSERT INTO public.risk_categories (name, description, weight_factor)
VALUES 
    ('credit', 'Credit history and patterns', 1.0),
    ('capacity', 'Ability to repay', 1.0),
    ('capital', 'Assets and reserves', 1.0),
    ('collateral', 'Security for the loan', 1.0),
    ('conditions', 'Economic conditions', 1.0),
    ('character', 'Borrower reliability and integrity', 1.0);

-- Insert default risk map views
INSERT INTO public.risk_map_views (type, description, is_active)
VALUES 
    ('standard', 'Standard risk assessment view', true),
    ('report', 'Detailed report view', true),
    ('lab', 'Experimental risk analysis', true),
    ('score', 'Risk score focused view', true);
```
