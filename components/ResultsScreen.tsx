'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TaxCalculation } from '@/types';
import { formatCurrency, formatCurrencyShort } from '@/lib/taxCalculator';

interface ResultsScreenProps {
  calculation: TaxCalculation;
  onRestart: () => void;
  onBack: () => void;
}

export default function ResultsScreen({
  calculation,
  onRestart,
  onBack,
}: ResultsScreenProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 overflow-auto">
      <div className="max-w-2xl mx-auto p-4 py-8">
        {/* Confetti Effect */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Tax Calculation
          </h1>
        </motion.div>

        {/* Main Result Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8 mb-6"
        >
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 mb-2">
              Estimated Tax Savings
            </div>
            <div className="text-6xl font-bold text-green-600 mb-4">
              {formatCurrencyShort(calculation.estimatedRefund)}
            </div>
            <div className="text-gray-600">
              You claimed{' '}
              <strong>
                {calculation.claimedReliefs.filter((r) => r.claimed).length}
              </strong>{' '}
              out of <strong>19</strong> possible reliefs
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-sm text-blue-700 mb-1">Annual Income</div>
              <div className="text-xl font-bold text-blue-900">
                {formatCurrencyShort(calculation.income)}
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-sm text-green-700 mb-1">Total Reliefs</div>
              <div className="text-xl font-bold text-green-900">
                {formatCurrencyShort(calculation.totalReliefs)}
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-sm text-purple-700 mb-1">
                Chargeable Income
              </div>
              <div className="text-xl font-bold text-purple-900">
                {formatCurrencyShort(calculation.chargeableIncome)}
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="text-sm text-orange-700 mb-1">Tax Payable</div>
              <div className="text-xl font-bold text-orange-900">
                {formatCurrencyShort(calculation.taxPayable)}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-shadow"
          >
            {showDetails ? 'Hide Details' : 'Show Full Breakdown'}
          </button>
        </motion.div>

        {/* Detailed Breakdown */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-2xl shadow-2xl p-6 mb-6"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Relief Breakdown
            </h2>

            <div className="space-y-3">
              {calculation.claimedReliefs
                .filter((r) => r.claimed)
                .map((claimedRelief) => {
                  const taxSaved =
                    claimedRelief.amount *
                    (calculation.estimatedRefund / calculation.totalReliefs);

                  return (
                    <div
                      key={claimedRelief.relief.id}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="text-3xl">{claimedRelief.relief.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          {claimedRelief.relief.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          Relief: {formatCurrency(claimedRelief.amount)}
                        </div>
                        <div className="text-xs text-green-600">
                          Tax saved: ~{formatCurrency(taxSaved)}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-2">
                📋 Documents You Need
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ EA form from employer</li>
                <li>✓ Receipts for all claimed reliefs</li>
                <li>✓ Insurance premium statements</li>
                <li>✓ Medical bills and invoices</li>
                <li>✓ Education fee receipts</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-2">
                📝 E-Filing Guide
              </h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Go to mytax.hasil.gov.my</li>
                <li>Login with your e-Filing PIN</li>
                <li>Select Form BE (Individual)</li>
                <li>Enter your income from EA form</li>
                <li>Claim reliefs in respective sections</li>
                <li>Review and submit</li>
              </ol>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            Start New Calculation
          </motion.button>

          <button
            onClick={onBack}
            className="w-full text-gray-600 font-semibold py-3 hover:text-gray-800 transition-colors"
          >
            ← Back to Swipe
          </button>

          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Want to save this calculation?
            </p>
            <button className="text-blue-600 font-semibold hover:text-blue-700">
              📧 Email Me Results (Coming Soon)
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="text-sm text-red-800">
            <strong>⚠️ Important:</strong> This is an estimate only. Your
            actual tax may differ based on additional factors not captured in
            this calculation. Always verify with LHDN or a licensed tax agent
            before filing.
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            SaveTax.my is an estimation tool for educational purposes only.
          </p>
          <p className="mt-1">
            Tax calculations are based on LHDN Year of Assessment 2025 rates.
          </p>
        </div>
      </div>
    </div>
  );
}
