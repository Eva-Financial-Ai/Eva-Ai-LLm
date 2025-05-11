// Form template interfaces
export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  formType: string;
  data: Record<string, any>;
}

// Template collection type
export type FormTemplateCollection = Record<string, FormTemplate[]>;

// Export all form templates
export const formTemplates: FormTemplateCollection = {
  'credit-application': [
    {
      id: 'credit-app-standard',
      name: 'Standard Credit Application',
      description: 'Complete credit application for standard business financing',
      formType: 'credit-application',
      data: {
        businessName: 'ABC Manufacturing',
        businessType: 'Corporation',
        taxId: '12-3456789',
        dateEstablished: '2015-06-15',
        industry: 'manufacturing',
        businessPhone: '(555) 123-4567',
        businessEmail: 'contact@abcmanufacturing.com',
        website: 'https://www.abcmanufacturing.com',
        businessAddress: '123 Industry Way',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        ownerFirstName: 'John',
        ownerLastName: 'Smith',
        title: 'CEO',
        ownershipPercentage: 75,
        ssn: '123-45-6789',
        dateOfBirth: '1975-08-22',
        homeAddress: '456 Residential St',
        homeCity: 'Chicago',
        homeState: 'IL',
        homeZipCode: '60610',
        amountRequested: 250000,
        termRequested: 60,
        useOfFunds: 'Purchase of new manufacturing equipment and expansion of production line',
        collateralDescription: 'Existing equipment and new equipment to be purchased',
        annualRevenue: 1500000,
        monthlyRevenue: 125000,
        outstandingDebt: 150000,
        monthlyRent: 8500
      }
    },
    {
      id: 'credit-app-startup',
      name: 'Startup Business Application',
      description: 'Credit application template for newer businesses',
      formType: 'credit-application',
      data: {
        businessName: 'TechStart Solutions',
        businessType: 'LLC',
        taxId: '98-7654321',
        dateEstablished: '2022-03-10',
        industry: 'technology',
        businessPhone: '(555) 987-6543',
        businessEmail: 'info@techstart.io',
        website: 'https://www.techstart.io',
        businessAddress: '789 Innovation Blvd',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        ownerFirstName: 'Jessica',
        ownerLastName: 'Lee',
        title: 'Founder',
        ownershipPercentage: 100,
        ssn: '987-65-4321',
        dateOfBirth: '1988-11-14',
        homeAddress: '321 Tech Ave',
        homeCity: 'San Francisco',
        homeState: 'CA',
        homeZipCode: '94110',
        amountRequested: 75000,
        termRequested: 36,
        useOfFunds: 'Product development and marketing for SaaS platform launch',
        collateralDescription: 'Personal guarantee and software IP',
        annualRevenue: 250000,
        monthlyRevenue: 20833,
        outstandingDebt: 25000,
        monthlyRent: 3500
      }
    }
  ],
  'additional-owner-individual': [
    {
      id: 'add-owner-individual-standard',
      name: 'Co-Owner Template',
      description: 'Standard template for additional business co-owner',
      formType: 'additional-owner-individual',
      data: {
        firstName: 'Michael',
        lastName: 'Johnson',
        title: 'CFO',
        dateOfBirth: '1980-03-15',
        ssn: '234-56-7890',
        ownershipPercentage: 25,
        email: 'michael@abcmanufacturing.com',
        phone: '(555) 234-5678',
        homeAddress: '789 Residential Ave',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60615',
        yearsAtAddress: 8,
        idType: 'drivers_license',
        idNumber: 'IL1234567',
        issuingState: 'IL',
        expirationDate: '2026-05-20',
        annualIncome: 180000,
        netWorth: 1200000,
        creditScore: 780,
        bankruptcyHistory: false,
        criminalHistory: false
      }
    },
    {
      id: 'add-owner-individual-minimal',
      name: 'Minority Owner Template',
      description: 'Template for minority owner with less than 20% ownership',
      formType: 'additional-owner-individual',
      data: {
        firstName: 'Sarah',
        lastName: 'Williams',
        title: 'COO',
        dateOfBirth: '1982-07-22',
        ssn: '345-67-8901',
        ownershipPercentage: 15,
        email: 'sarah@abcmanufacturing.com',
        phone: '(555) 345-6789',
        homeAddress: '101 Residential Blvd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60618',
        yearsAtAddress: 5,
        idType: 'passport',
        idNumber: '987654321',
        issuingState: 'N/A',
        expirationDate: '2028-09-15',
        annualIncome: 160000,
        netWorth: 850000,
        creditScore: 760,
        bankruptcyHistory: false,
        criminalHistory: false
      }
    }
  ],
  'additional-owner-business': [
    {
      id: 'add-owner-business-standard',
      name: 'Corporate Parent Template',
      description: 'Template for parent company ownership structure',
      formType: 'additional-owner-business',
      data: {
        businessName: 'XYZ Holdings, Inc.',
        businessType: 'Corporation',
        taxId: '23-4567890',
        stateOfIncorporation: 'DE',
        dateEstablished: '2010-01-15',
        ownershipPercentage: 60,
        businessAddress: '100 Corporate Plaza',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        authorizedContactName: 'Robert Chen',
        contactTitle: 'President',
        contactEmail: 'robert@xyzholdings.com',
        contactPhone: '(555) 456-7890',
        annualRevenue: 5000000,
        netWorth: 12000000,
        numberOfEmployees: 45,
        industryType: 'financial_services',
        businessDescription: 'Investment holding company with interests in manufacturing and technology sectors'
      }
    },
    {
      id: 'add-owner-business-partner',
      name: 'Strategic Partner Template',
      description: 'Template for partnership or joint venture entity',
      formType: 'additional-owner-business',
      data: {
        businessName: 'Global Ventures LLC',
        businessType: 'LLC',
        taxId: '34-5678901',
        stateOfIncorporation: 'CA',
        dateEstablished: '2018-05-20',
        ownershipPercentage: 40,
        businessAddress: '200 Partnership Way',
        city: 'San Jose',
        state: 'CA',
        zipCode: '95110',
        authorizedContactName: 'Lisa Wong',
        contactTitle: 'Managing Partner',
        contactEmail: 'lisa@globalventures.com',
        contactPhone: '(555) 567-8901',
        annualRevenue: 2500000,
        netWorth: 7500000,
        numberOfEmployees: 25,
        industryType: 'venture_capital',
        businessDescription: 'Strategic investment firm focusing on early-stage technology companies'
      }
    }
  ],
  'additional-owner-trust': [
    {
      id: 'add-owner-trust-family',
      name: 'Family Trust Template',
      description: 'Template for family trust ownership structure',
      formType: 'additional-owner-trust',
      data: {
        trustName: 'Smith Family Trust',
        trustType: 'Revocable Living Trust',
        taxId: '45-6789012',
        dateEstablished: '2015-08-12',
        stateOfFormation: 'IL',
        ownershipPercentage: 30,
        trusteeFirstName: 'David',
        trusteeLastName: 'Smith',
        trusteeEmail: 'david@smithfamily.com',
        trusteePhone: '(555) 678-9012',
        trusteeAddress: '300 Trust Lane',
        trusteeCity: 'Chicago',
        trusteeState: 'IL',
        trusteeZipCode: '60620',
        beneficiaryName: 'Smith Family Members',
        assetValue: 3500000,
        trustPurpose: 'Estate planning and business succession'
      }
    },
    {
      id: 'add-owner-trust-pension',
      name: 'Pension Trust Template',
      description: 'Template for pension or retirement trust',
      formType: 'additional-owner-trust',
      data: {
        trustName: 'ABC Manufacturing Pension Trust',
        trustType: 'Qualified Retirement Trust',
        taxId: '56-7890123',
        dateEstablished: '2012-01-30',
        stateOfFormation: 'IL',
        ownershipPercentage: 20,
        trusteeFirstName: 'William',
        trusteeLastName: 'Jones',
        trusteeEmail: 'william@pensiontrust.com',
        trusteePhone: '(555) 789-0123',
        trusteeAddress: '400 Retirement Rd',
        trusteeCity: 'Chicago',
        trusteeState: 'IL',
        trusteeZipCode: '60625',
        beneficiaryName: 'ABC Manufacturing Employees',
        assetValue: 4200000,
        trustPurpose: 'Employee retirement benefits'
      }
    }
  ],
  'business-debt-schedule': [
    {
      id: 'debt-schedule-standard',
      name: 'Standard Debt Schedule',
      description: 'Template for tracking business debt obligations',
      formType: 'business-debt-schedule',
      data: {
        companyName: 'ABC Manufacturing',
        asOfDate: '2023-09-30',
        preparedBy: 'John Smith',
        debts: [
          {
            creditorName: 'First National Bank',
            originalAmount: 500000,
            originalDate: '2019-05-15',
            currentBalance: 350000,
            interestRate: 5.25,
            monthlyPayment: 9500,
            maturityDate: '2029-05-15',
            collateral: 'Real Estate',
            debtType: 'Mortgage'
          },
          {
            creditorName: 'Equipment Finance LLC',
            originalAmount: 250000,
            originalDate: '2021-08-10',
            currentBalance: 190000,
            interestRate: 4.75,
            monthlyPayment: 4800,
            maturityDate: '2026-08-10',
            collateral: 'Machinery & Equipment',
            debtType: 'Equipment Loan'
          },
          {
            creditorName: 'Business Credit Line',
            originalAmount: 100000,
            originalDate: '2022-03-01',
            currentBalance: 65000,
            interestRate: 7.5,
            monthlyPayment: 2500,
            maturityDate: '2024-03-01',
            collateral: 'Accounts Receivable',
            debtType: 'Line of Credit'
          }
        ]
      }
    }
  ],
  'personal-finance-statement': [
    {
      id: 'pfs-standard',
      name: 'Standard Personal Financial Statement',
      description: 'Standard SBA Form 413 compliant financial statement',
      formType: 'personal-finance-statement',
      data: {
        asOfDate: '2023-09-30',
        personalInfo: {
          firstName: 'John',
          lastName: 'Smith',
          homeAddress: '456 Residential St',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60610',
          businessPhone: '(555) 123-4567',
          homePhone: '(555) 987-6543',
          email: 'john.smith@email.com',
          businessName: 'ABC Manufacturing',
          businessType: 'Corporation'
        },
        assets: {
          cashOnHand: 25000,
          savingsAccounts: 150000,
          checkingAccounts: 35000,
          irasAndRetirement: 850000,
          accountsReceivable: 0,
          lifeInsuranceCashValue: 250000,
          stocksAndBonds: 450000,
          realEstate: 1200000,
          automobiles: 65000,
          otherPersonalProperty: 100000,
          otherAssets: 75000
        },
        liabilities: {
          accountsPayable: 0,
          notesPayable: 0,
          installmentAccountAuto: 35000,
          installmentAccountOther: 10000,
          loanOnLifeInsurance: 0,
          mortgageOnRealEstate: 750000,
          unpaidTaxes: 15000,
          otherLiabilities: 0
        },
        realEstateAssets: [
          {
            id: '1',
            typeOfProperty: 'Primary Residence',
            address: '456 Residential St, Chicago, IL 60610',
            dateAcquired: '2015-03-17',
            originalCost: 950000,
            presentMarketValue: 1200000,
            mortgageHolder: 'First National Bank',
            mortgageBalance: 750000,
            monthlyPayment: 4500
          }
        ]
      }
    }
  ],
  'asset-ledger': [
    {
      id: 'asset-ledger-standard',
      name: 'Standard Asset Ledger',
      description: 'Standard template for tracking business assets',
      formType: 'asset-ledger',
      data: {
        companyName: 'ABC Manufacturing',
        asOfDate: '2023-09-30',
        preparedBy: 'John Smith',
        assets: [
          {
            assetType: 'Real Estate',
            description: 'Manufacturing Facility',
            acquisitionDate: '2015-06-20',
            purchasePrice: 2500000,
            currentValue: 3200000,
            location: '123 Industry Way, Chicago, IL 60601',
            titleHolder: 'ABC Manufacturing',
            encumbrances: 'Mortgage: First National Bank',
            insurancePolicy: 'Policy #RE-12345',
            insuranceValue: 3500000
          },
          {
            assetType: 'Equipment',
            description: 'CNC Machining Center',
            acquisitionDate: '2021-04-15',
            purchasePrice: 450000,
            currentValue: 375000,
            location: 'Main Plant Floor',
            titleHolder: 'ABC Manufacturing',
            encumbrances: 'Equipment Loan: Equipment Finance LLC',
            insurancePolicy: 'Policy #EQ-45678',
            insuranceValue: 450000
          },
          {
            assetType: 'Vehicle',
            description: '2022 Ford F-250 Work Truck',
            acquisitionDate: '2022-01-10',
            purchasePrice: 65000,
            currentValue: 55000,
            location: 'Company Fleet',
            titleHolder: 'ABC Manufacturing',
            encumbrances: 'Auto Loan: Ford Credit',
            insurancePolicy: 'Policy #VH-78901',
            insuranceValue: 65000
          }
        ]
      }
    }
  ]
}; 