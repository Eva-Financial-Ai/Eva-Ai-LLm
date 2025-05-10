import React, { useState } from 'react';

interface PersonalFinanceStatementProps {
  onSubmit: (data: any) => void;
  onSave: (data: any) => void;
}

const PersonalFinanceStatement: React.FC<PersonalFinanceStatementProps> = ({
  onSubmit,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    businessName: '',
    homeAddress: '',
    businessAddress: '',
    homePhone: '',
    businessPhone: '',
    email: '',
    businessType: '',
    dateOfBirth: '',
    ssn: '',

    // Assets
    cashOnHand: 0,
    savingsAccounts: 0,
    irasAndOtherRetirement: 0,
    accountsReceivable: 0,
    lifeInsuranceCashValue: 0,
    stocksAndBonds: 0,
    realEstate: 0,
    automobiles: 0,
    otherPersonalProperty: 0,
    otherAssets: 0,

    // Liabilities
    accountsPayable: 0,
    notesPayable: 0,
    autoLoans: 0,
    creditCardDebt: 0,
    installmentLoans: 0,
    lifeInsuranceLoans: 0,
    mortgages: 0,
    unpaidTaxes: 0,
    otherLiabilities: 0,

    // Income and Expenditures
    salary: 0,
    netInvestmentIncome: 0,
    realEstateIncome: 0,
    otherIncome: 0,

    mortgagePayment: 0,
    carPayment: 0,
    creditCardPayment: 0,
    insurancePayment: 0,
    otherExpenses: 0,

    // Contingent Liabilities
    asEndorser: 0,
    legalClaims: 0,
    provision: 0,
    otherContingentLiabilities: 0,

    // Additional Information
    bankruptcy: false,
    lawsuit: false,
    taxes: false,
    lifeInsurance: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number' ||
              name.includes('cash') ||
              name.includes('amount') ||
              name.includes('value') ||
              name.includes('income') ||
              name.includes('payment') ||
              name.includes('debt') ||
              name.includes('expense')
            ? parseFloat(value) || 0
            : value,
    }));
  };

  const calculateTotalAssets = () => {
    const {
      cashOnHand,
      savingsAccounts,
      irasAndOtherRetirement,
      accountsReceivable,
      lifeInsuranceCashValue,
      stocksAndBonds,
      realEstate,
      automobiles,
      otherPersonalProperty,
      otherAssets,
    } = formData;

    return (
      cashOnHand +
      savingsAccounts +
      irasAndOtherRetirement +
      accountsReceivable +
      lifeInsuranceCashValue +
      stocksAndBonds +
      realEstate +
      automobiles +
      otherPersonalProperty +
      otherAssets
    );
  };

  const calculateTotalLiabilities = () => {
    const {
      accountsPayable,
      notesPayable,
      autoLoans,
      creditCardDebt,
      installmentLoans,
      lifeInsuranceLoans,
      mortgages,
      unpaidTaxes,
      otherLiabilities,
    } = formData;

    return (
      accountsPayable +
      notesPayable +
      autoLoans +
      creditCardDebt +
      installmentLoans +
      lifeInsuranceLoans +
      mortgages +
      unpaidTaxes +
      otherLiabilities
    );
  };

  const calculateNetWorth = () => {
    return calculateTotalAssets() - calculateTotalLiabilities();
  };

  const calculateTotalIncome = () => {
    const { salary, netInvestmentIncome, realEstateIncome, otherIncome } = formData;
    return salary + netInvestmentIncome + realEstateIncome + otherIncome;
  };

  const calculateTotalExpenses = () => {
    const { mortgagePayment, carPayment, creditCardPayment, insurancePayment, otherExpenses } =
      formData;
    return mortgagePayment + carPayment + creditCardPayment + insurancePayment + otherExpenses;
  };

  const calculateTotalContingentLiabilities = () => {
    const { asEndorser, legalClaims, provision, otherContingentLiabilities } = formData;
    return asEndorser + legalClaims + provision + otherContingentLiabilities;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Financial Statement</h2>
      <p className="text-sm text-gray-600 mb-6">
        Complete this form for: (1) each proprietor, or (2) each limited partner who owns 20% or
        more interest, or (3) each stockholder owning 20% or more of voting stock, or (4) any person
        providing a guaranty on the loan.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Section 1: Personal Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Business Name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Home Address</label>
              <input
                type="text"
                name="homeAddress"
                value={formData.homeAddress}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Street, City, State, Zip"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Address
              </label>
              <input
                type="text"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Street, City, State, Zip"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Home Phone</label>
              <input
                type="tel"
                name="homePhone"
                value={formData.homePhone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(XXX) XXX-XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
              <input
                type="tel"
                name="businessPhone"
                value={formData.businessPhone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(XXX) XXX-XXXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Business Type</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="LLC">LLC</option>
                <option value="S-Corporation">S-Corporation</option>
                <option value="C-Corporation">C-Corporation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Social Security Number
              </label>
              <input
                type="text"
                name="ssn"
                value={formData.ssn}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="XXX-XX-XXXX"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Assets and Liabilities */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">
            Assets and Liabilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Assets Column */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Assets</h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cash on Hand & in Banks
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="cashOnHand"
                      value={formData.cashOnHand}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Savings Accounts
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="savingsAccounts"
                      value={formData.savingsAccounts}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IRAs & Other Retirement Accounts
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="irasAndOtherRetirement"
                      value={formData.irasAndOtherRetirement}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accounts Receivable
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="accountsReceivable"
                      value={formData.accountsReceivable}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Life Insurance Cash Value
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="lifeInsuranceCashValue"
                      value={formData.lifeInsuranceCashValue}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stocks and Bonds
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="stocksAndBonds"
                      value={formData.stocksAndBonds}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Real Estate
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="realEstate"
                      value={formData.realEstate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Automobiles
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="automobiles"
                      value={formData.automobiles}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Personal Property
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="otherPersonalProperty"
                      value={formData.otherPersonalProperty}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Assets
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="otherAssets"
                      value={formData.otherAssets}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Total Assets</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      value={calculateTotalAssets()}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Liabilities Column */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Liabilities</h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accounts Payable
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="accountsPayable"
                      value={formData.accountsPayable}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes Payable
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="notesPayable"
                      value={formData.notesPayable}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auto Loans</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="autoLoans"
                      value={formData.autoLoans}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credit Card Debt
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="creditCardDebt"
                      value={formData.creditCardDebt}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Installment Loans
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="installmentLoans"
                      value={formData.installmentLoans}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Life Insurance Loans
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="lifeInsuranceLoans"
                      value={formData.lifeInsuranceLoans}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mortgages</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="mortgages"
                      value={formData.mortgages}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unpaid Taxes
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="unpaidTaxes"
                      value={formData.unpaidTaxes}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Liabilities
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="otherLiabilities"
                      value={formData.otherLiabilities}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Total Liabilities
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      value={calculateTotalLiabilities()}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h4 className="text-md font-bold text-gray-700 mb-3">Net Worth</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Assets</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    value={calculateTotalAssets()}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Liabilities
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    value={calculateTotalLiabilities()}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Net Worth</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-bold"
                    value={calculateNetWorth()}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">
            Additional Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Have you filed for bankruptcy in the past 7 years?
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="bankruptcy-yes"
                    name="bankruptcy"
                    type="radio"
                    value="yes"
                    checked={formData.bankruptcy === true}
                    onChange={() => setFormData({ ...formData, bankruptcy: true })}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="bankruptcy-yes" className="ml-2 block text-sm text-gray-700">
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="bankruptcy-no"
                    name="bankruptcy"
                    type="radio"
                    value="no"
                    checked={formData.bankruptcy === false}
                    onChange={() => setFormData({ ...formData, bankruptcy: false })}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="bankruptcy-no" className="ml-2 block text-sm text-gray-700">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Are you currently a defendant in any lawsuit?
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="lawsuit-yes"
                    name="lawsuit"
                    type="radio"
                    value="yes"
                    checked={formData.lawsuit === true}
                    onChange={() => setFormData({ ...formData, lawsuit: true })}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="lawsuit-yes" className="ml-2 block text-sm text-gray-700">
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="lawsuit-no"
                    name="lawsuit"
                    type="radio"
                    value="no"
                    checked={formData.lawsuit === false}
                    onChange={() => setFormData({ ...formData, lawsuit: false })}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="lawsuit-no" className="ml-2 block text-sm text-gray-700">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Are you current on all tax payments?
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="taxes-yes"
                    name="taxes"
                    type="radio"
                    value="yes"
                    checked={formData.taxes === true}
                    onChange={() => setFormData({ ...formData, taxes: true })}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="taxes-yes" className="ml-2 block text-sm text-gray-700">
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="taxes-no"
                    name="taxes"
                    type="radio"
                    value="no"
                    checked={formData.taxes === false}
                    onChange={() => setFormData({ ...formData, taxes: false })}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="taxes-no" className="ml-2 block text-sm text-gray-700">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certification */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Certification</h3>

          <div className="flex items-start mb-4">
            <input
              id="accuracy-certification"
              type="checkbox"
              className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="accuracy-certification" className="ml-2 text-sm text-gray-700">
              I certify that all information provided in this Personal Financial Statement is true
              and accurate to the best of my knowledge.
            </label>
          </div>

          <div className="flex items-start">
            <input
              id="info-certification"
              type="checkbox"
              className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="info-certification" className="ml-2 text-sm text-gray-700">
              I authorize the lender to verify any information provided, obtain my credit report,
              and exchange information with others about my credit and financial situation.
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => onSave(formData)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalFinanceStatement;
