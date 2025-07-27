import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Users, Building, Home, Heart, GraduationCap } from 'lucide-react';

const BangladeshTaxFilingSystem = () => {
    const [taxpayerType, setTaxpayerType] = useState('general');
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState(30);
    const [income, setIncome] = useState({
        basicSalary: 0,
        houseAllowance: 0,
        medicalAllowance: 0,
        conveyance: 0,
        bonus: 0,
        others: 0,
        businessIncome: 0,
        rentalIncome: 0,
        capitalGains: 0,
        additionalIncome: 0
    });

    const [investments, setInvestments] = useState({
        recognizedProvidentFund: 0,
        dps: 0,
        lifeInsurance: 0,
        govtSecurities: 0,
        stockMarket: 0,
        zakat: 0,
        donation: 0
    });

    const [taxDeductedAtSource, setTaxDeductedAtSource] = useState(0);

    // Tax slabs based on your specific calculation (FY 2024-25)
    const taxSlabs = {
        general: {
            male: [
                { min: 0, max: 350000, rate: 0, maxAmount: 350000 },
                { min: 350000, max: 450000, rate: 5, maxAmount: 100000 },
                { min: 450000, max: 850000, rate: 10, maxAmount: 400000 },
                { min: 850000, max: 1350000, rate: 15, maxAmount: 500000 },
                { min: 1350000, max: 1850000, rate: 20, maxAmount: 500000 },
                { min: 1850000, max: Infinity, rate: 25, maxAmount: Infinity }
            ],
            female: [
                { min: 0, max: 400000, rate: 0, maxAmount: 400000 },
                { min: 400000, max: 500000, rate: 5, maxAmount: 100000 },
                { min: 500000, max: 900000, rate: 10, maxAmount: 400000 },
                { min: 900000, max: 1400000, rate: 15, maxAmount: 500000 },
                { min: 1400000, max: 1900000, rate: 20, maxAmount: 500000 },
                { min: 1900000, max: Infinity, rate: 25, maxAmount: Infinity }
            ]
        },
        senior: {
            male: [
                { min: 0, max: 425000, rate: 0, maxAmount: 425000 },
                { min: 425000, max: 525000, rate: 5, maxAmount: 100000 },
                { min: 525000, max: 925000, rate: 10, maxAmount: 400000 },
                { min: 925000, max: 1425000, rate: 15, maxAmount: 500000 },
                { min: 1425000, max: 1925000, rate: 20, maxAmount: 500000 },
                { min: 1925000, max: Infinity, rate: 25, maxAmount: Infinity }
            ],
            female: [
                { min: 0, max: 475000, rate: 0, maxAmount: 475000 },
                { min: 475000, max: 575000, rate: 5, maxAmount: 100000 },
                { min: 575000, max: 975000, rate: 10, maxAmount: 400000 },
                { min: 975000, max: 1475000, rate: 15, maxAmount: 500000 },
                { min: 1475000, max: 1975000, rate: 20, maxAmount: 500000 },
                { min: 1975000, max: Infinity, rate: 25, maxAmount: Infinity }
            ]
        },
        disabled: {
            male: [
                { min: 0, max: 475000, rate: 0, maxAmount: 475000 },
                { min: 475000, max: 575000, rate: 5, maxAmount: 100000 },
                { min: 575000, max: 975000, rate: 10, maxAmount: 400000 },
                { min: 975000, max: 1475000, rate: 15, maxAmount: 500000 },
                { min: 1475000, max: 1975000, rate: 20, maxAmount: 500000 },
                { min: 1975000, max: Infinity, rate: 25, maxAmount: Infinity }
            ],
            female: [
                { min: 0, max: 475000, rate: 0, maxAmount: 475000 },
                { min: 475000, max: 575000, rate: 5, maxAmount: 100000 },
                { min: 575000, max: 975000, rate: 10, maxAmount: 400000 },
                { min: 975000, max: 1475000, rate: 15, maxAmount: 500000 },
                { min: 1475000, max: 1975000, rate: 20, maxAmount: 500000 },
                { min: 1975000, max: Infinity, rate: 25, maxAmount: Infinity }
            ]
        },
        gazettedFreedomFighter: {
            male: [
                { min: 0, max: 500000, rate: 0, maxAmount: 500000 },
                { min: 500000, max: 600000, rate: 5, maxAmount: 100000 },
                { min: 600000, max: 1000000, rate: 10, maxAmount: 400000 },
                { min: 1000000, max: 1500000, rate: 15, maxAmount: 500000 },
                { min: 1500000, max: 2000000, rate: 20, maxAmount: 500000 },
                { min: 2000000, max: Infinity, rate: 25, maxAmount: Infinity }
            ],
            female: [
                { min: 0, max: 500000, rate: 0, maxAmount: 500000 },
                { min: 500000, max: 600000, rate: 5, maxAmount: 100000 },
                { min: 600000, max: 1000000, rate: 10, maxAmount: 400000 },
                { min: 1000000, max: 1500000, rate: 15, maxAmount: 500000 },
                { min: 1500000, max: 2000000, rate: 20, maxAmount: 500000 },
                { min: 2000000, max: Infinity, rate: 25, maxAmount: Infinity }
            ]
        }
    };

    const calculateTotalIncome = () => {
        return Object.values(income).reduce((sum, value) => sum + value, 0);
    };

    const calculateTotalInvestment = () => {
        const maxInvestmentRebate = Math.min(calculateTotalIncome() * 0.25, 1500000);
        const totalInvestments = Object.values(investments).reduce((sum, value) => sum + value, 0);
        return Math.min(totalInvestments, maxInvestmentRebate);
    };

    const calculateTaxFreeIncome = () => {
        const totalIncome = calculateTotalIncome();
        const oneThirdIncome = totalIncome / 3;
        const maxTaxFree = 450000;
        return Math.min(oneThirdIncome, maxTaxFree);
    };

    const calculateTaxableIncome = () => {
        const totalIncome = calculateTotalIncome();
        const taxFreeIncome = calculateTaxFreeIncome();
        return Math.max(0, totalIncome - taxFreeIncome);
    };

    const calculateTax = () => {
        const taxableIncome = calculateTaxableIncome();
        const applicableSlabs = taxSlabs[taxpayerType][gender];
        let tax = 0;
        let remainingIncome = taxableIncome;

        for (let slab of applicableSlabs) {
            if (remainingIncome > 0 && taxableIncome > slab.min) {
                const slabRange = slab.max === Infinity ? remainingIncome : Math.min(slab.max - slab.min, remainingIncome);
                const taxableAtThisSlab = Math.min(remainingIncome, slabRange);
                tax += (taxableAtThisSlab * slab.rate) / 100;
                remainingIncome -= taxableAtThisSlab;
            }
        }

        return tax;
    };

    const getDetailedTaxCalculation = () => {
        const taxableIncome = calculateTaxableIncome();
        const applicableSlabs = taxSlabs[taxpayerType][gender];
        let tax = 0;
        let remainingIncome = taxableIncome;
        const details = [];

        for (let i = 0; i < applicableSlabs.length; i++) {
            const slab = applicableSlabs[i];
            if (remainingIncome > 0 && taxableIncome > slab.min) {
                const slabRange = slab.max === Infinity ? remainingIncome : Math.min(slab.max - slab.min, remainingIncome);
                const taxableAtThisSlab = Math.min(remainingIncome, slabRange);
                const slabTax = (taxableAtThisSlab * slab.rate) / 100;

                details.push({
                    slabNo: i + 1,
                    maxAmount: slab.maxAmount === Infinity ? remainingIncome : slab.maxAmount,
                    restIncome: remainingIncome,
                    rate: slab.rate,
                    selectedAmount: taxableAtThisSlab,
                    slabDeductedEarning: remainingIncome - taxableAtThisSlab,
                    tax: slabTax
                });

                tax += slabTax;
                remainingIncome -= taxableAtThisSlab;
            } else {
                details.push({
                    slabNo: i + 1,
                    maxAmount: slab.maxAmount === Infinity ? 0 : slab.maxAmount,
                    restIncome: remainingIncome,
                    rate: slab.rate,
                    selectedAmount: 0,
                    slabDeductedEarning: remainingIncome,
                    tax: 0
                });
            }
        }

        return { totalTax: tax, details };
    };

    const calculateInvestmentRebate = () => {
        return calculateTotalInvestment() * 0.15; // 15% rebate on investment
    };

    const calculateNetTaxPayable = () => {
        const grossTax = calculateTax();
        const rebate = calculateInvestmentRebate();
        const taxAfterRebate = Math.max(0, grossTax - rebate);
        return Math.max(0, taxAfterRebate - taxDeductedAtSource);
    };

    const calculateRefundOrDue = () => {
        const grossTax = calculateTax();
        const rebate = calculateInvestmentRebate();
        const taxAfterRebate = Math.max(0, grossTax - rebate);
        const difference = taxAfterRebate - taxDeductedAtSource;

        return {
            amount: Math.abs(difference),
            type: difference > 0 ? 'due' : 'refund'
        };
    };

    const handleIncomeChange = (field, value) => {
        setIncome(prev => ({
            ...prev,
            [field]: parseFloat(value) || 0
        }));
    };

    const handleInvestmentChange = (field, value) => {
        setInvestments(prev => ({
            ...prev,
            [field]: parseFloat(value) || 0
        }));
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-green-800 mb-2">Bangladesh Income Tax Filing System</h1>
                <p className="text-gray-600">Assessment Year 2025-26 (Income Year 2024-25)</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Taxpayer Information */}
                <div className="bg-green-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                        <Users className="mr-2" size={20} />
                        Taxpayer Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Taxpayer Category</label>
                            <select
                                value={taxpayerType}
                                onChange={(e) => setTaxpayerType(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                            >
                                <option value="general">General Taxpayer</option>
                                <option value="senior">Senior Citizen (65+)</option>
                                <option value="disabled">Disabled Person</option>
                                <option value="gazettedFreedomFighter">Gazetted Freedom Fighter</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Income Details */}
                <div className="bg-blue-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                        <Building className="mr-2" size={20} />
                        Income Details (BDT)
                    </h2>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                            <input
                                type="number"
                                value={income.basicSalary}
                                onChange={(e) => handleIncomeChange('basicSalary', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">House Allowance</label>
                            <input
                                type="number"
                                value={income.houseAllowance}
                                onChange={(e) => handleIncomeChange('houseAllowance', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Medical Allowance</label>
                            <input
                                type="number"
                                value={income.medicalAllowance}
                                onChange={(e) => handleIncomeChange('medicalAllowance', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Conveyance</label>
                            <input
                                type="number"
                                value={income.conveyance}
                                onChange={(e) => handleIncomeChange('conveyance', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bonus</label>
                            <input
                                type="number"
                                value={income.bonus}
                                onChange={(e) => handleIncomeChange('bonus', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Others</label>
                            <input
                                type="number"
                                value={income.others}
                                onChange={(e) => handleIncomeChange('others', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Income</label>
                            <input
                                type="number"
                                value={income.businessIncome}
                                onChange={(e) => handleIncomeChange('businessIncome', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rental Income</label>
                            <input
                                type="number"
                                value={income.rentalIncome}
                                onChange={(e) => handleIncomeChange('rentalIncome', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capital Gains</label>
                            <input
                                type="number"
                                value={income.capitalGains}
                                onChange={(e) => handleIncomeChange('capitalGains', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Income</label>
                            <input
                                type="number"
                                value={income.additionalIncome}
                                onChange={(e) => handleIncomeChange('additionalIncome', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Investment & Rebate */}
                <div className="bg-purple-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
                        <GraduationCap className="mr-2" size={20} />
                        Investment & Rebate (BDT)
                    </h2>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Recognized Provident Fund</label>
                            <input
                                type="number"
                                value={investments.recognizedProvidentFund}
                                onChange={(e) => handleInvestmentChange('recognizedProvidentFund', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">DPS/Fixed Deposit</label>
                            <input
                                type="number"
                                value={investments.dps}
                                onChange={(e) => handleInvestmentChange('dps', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Life Insurance Premium</label>
                            <input
                                type="number"
                                value={investments.lifeInsurance}
                                onChange={(e) => handleInvestmentChange('lifeInsurance', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Government Securities</label>
                            <input
                                type="number"
                                value={investments.govtSecurities}
                                onChange={(e) => handleInvestmentChange('govtSecurities', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Market Investment</label>
                            <input
                                type="number"
                                value={investments.stockMarket}
                                onChange={(e) => handleInvestmentChange('stockMarket', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Zakat Payment</label>
                            <input
                                type="number"
                                value={investments.zakat}
                                onChange={(e) => handleInvestmentChange('zakat', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Charitable Donation</label>
                            <input
                                type="number"
                                value={investments.donation}
                                onChange={(e) => handleInvestmentChange('donation', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div className="pt-4 border-t border-purple-200">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Deducted at Source (TDS)</label>
                            <input
                                type="number"
                                value={taxDeductedAtSource}
                                onChange={(e) => setTaxDeductedAtSource(parseFloat(e.target.value) || 0)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter tax already deducted by employer"
                            />
                            <p className="text-xs text-gray-500 mt-1">Tax already paid through salary deduction</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tax Calculation Summary */}
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Calculator className="mr-2" size={24} />
                    Tax Calculation Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Total Income:</span>
                            <span className="text-blue-600 font-semibold">৳ {calculateTotalIncome().toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">1/3 of Total Income:</span>
                            <span className="text-purple-600 font-semibold">৳ {(calculateTotalIncome() / 3).toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Tax Free Income (Min of 1/3 or ৳4,50,000):</span>
                            <span className="text-green-600 font-semibold">৳ {calculateTaxFreeIncome().toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Total Investment:</span>
                            <span className="text-purple-600 font-semibold">৳ {calculateTotalInvestment().toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Taxable Income:</span>
                            <span className="text-orange-600 font-semibold">৳ {calculateTaxableIncome().toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Gross Tax:</span>
                            <span className="text-red-600 font-semibold">৳ {calculateTax().toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Investment Rebate (15%):</span>
                            <span className="text-green-600 font-semibold">৳ {calculateInvestmentRebate().toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Tax After Rebate:</span>
                            <span className="text-orange-600 font-semibold">৳ {Math.max(0, calculateTax() - calculateInvestmentRebate()).toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Tax Deducted at Source:</span>
                            <span className="text-blue-600 font-semibold">৳ {taxDeductedAtSource.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-2 border-green-500 rounded-lg bg-green-100">
              <span className="font-bold text-lg">
                {calculateRefundOrDue().type === 'due' ? 'Additional Tax Due:' : 'Tax Refund:'}
              </span>
                            <span className={`font-bold text-xl ${calculateRefundOrDue().type === 'due' ? 'text-red-800' : 'text-green-800'}`}>
                ৳ {calculateRefundOrDue().amount.toLocaleString()}
              </span>
                        </div>

                        <div className="text-sm text-gray-600 mt-4">
                            <p><strong>Tax Rate Applied:</strong> Based on {taxpayerType} {gender} category</p>
                            <p><strong>Tax Free Income:</strong> Min(1/3 of total income, ৳4,50,000)</p>
                            <p><strong>Taxable Income:</strong> Total Income - Tax Free Income</p>
                            <p><strong>Investment Rebate:</strong> 15% of qualified investments (deducted from gross tax)</p>
                            <p><strong>Maximum Investment Rebate:</strong> 25% of total income or ৳15,00,000 (whichever is lower)</p>
                            <p><strong>Tax Status:</strong>
                                {calculateRefundOrDue().type === 'due'
                                    ? 'You need to pay additional tax'
                                    : 'You are eligible for tax refund'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Tax Slab Calculation */}
            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                    Detailed Tax Slab Calculation
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-blue-300">
                        <thead>
                        <tr className="bg-blue-200">
                            <th className="border border-blue-300 p-2 text-left">Slabs</th>
                            <th className="border border-blue-300 p-2 text-left">Max Amount</th>
                            <th className="border border-blue-300 p-2 text-left">Rest Income</th>
                            <th className="border border-blue-300 p-2 text-left">%</th>
                            <th className="border border-blue-300 p-2 text-left">Selected Amount</th>
                            <th className="border border-blue-300 p-2 text-left">Slab Deducted Earning</th>
                            <th className="border border-blue-300 p-2 text-left">Tax</th>
                        </tr>
                        </thead>
                        <tbody>
                        {getDetailedTaxCalculation().details.map((detail, index) => (
                            <tr key={index} className="hover:bg-blue-100">
                                <td className="border border-blue-300 p-2">{detail.slabNo}{detail.slabNo === 1 ? 'st' : detail.slabNo === 2 ? 'nd' : detail.slabNo === 3 ? 'rd' : 'th'}</td>
                                <td className="border border-blue-300 p-2">৳ {detail.maxAmount.toLocaleString()}</td>
                                <td className="border border-blue-300 p-2">৳ {detail.restIncome.toLocaleString()}</td>
                                <td className="border border-blue-300 p-2">{detail.rate}%</td>
                                <td className="border border-blue-300 p-2">৳ {detail.selectedAmount.toLocaleString()}</td>
                                <td className="border border-blue-300 p-2">৳ {detail.slabDeductedEarning.toLocaleString()}</td>
                                <td className="border border-blue-300 p-2">৳ {detail.tax.toLocaleString()}</td>
                            </tr>
                        ))}
                        <tr className="bg-blue-200 font-semibold">
                            <td className="border border-blue-300 p-2" colSpan="6">Total</td>
                            <td className="border border-blue-300 p-2">৳ {getDetailedTaxCalculation().totalTax.toLocaleString()}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tax Slab Information */}
            <div className="mt-8 bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                    Applicable Tax Slabs ({taxpayerType} - {gender})
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-green-300">
                        <thead>
                        <tr className="bg-green-200">
                            <th className="border border-green-300 p-2 text-left">Income Range (BDT)</th>
                            <th className="border border-green-300 p-2 text-left">Tax Rate</th>
                            <th className="border border-green-300 p-2 text-left">Max Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {taxSlabs[taxpayerType][gender].map((slab, index) => (
                            <tr key={index} className="hover:bg-green-100">
                                <td className="border border-green-300 p-2">
                                    ৳ {slab.min.toLocaleString()} - {slab.max === Infinity ? 'Above' : `৳ ${slab.max.toLocaleString()}`}
                                </td>
                                <td className="border border-green-300 p-2">{slab.rate}%</td>
                                <td className="border border-green-300 p-2">৳ {slab.maxAmount === Infinity ? 'No Limit' : slab.maxAmount.toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                    This calculation is based on Bangladesh Income Tax Ordinance 1984 and Finance Act 2024.
                    Please consult with a tax professional for official filing.
                </p>
            </div>
        </div>
    );
};

export default BangladeshTaxFilingSystem;