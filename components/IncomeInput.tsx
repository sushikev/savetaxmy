'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface IncomeInputProps {
  onSubmit: (income: number) => void;
  onBack: () => void;
}

export default function IncomeInput({ onSubmit, onBack }: IncomeInputProps) {
  const [income, setIncome] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const numIncome = parseFloat(income.replace(/,/g, ''));

    if (!numIncome || numIncome <= 0) {
      setError('Please enter a valid annual income');
      return;
    }

    if (numIncome < 5000) {
      setError('Income too low for tax calculation');
      return;
    }

    onSubmit(numIncome);
  };

  const formatNumber = (value: string) => {
    const num = value.replace(/,/g, '');
    if (num === '') return '';
    return parseFloat(num).toLocaleString('en-MY');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      setIncome(value);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="text-5xl text-center mb-6">💼</div>

        <h2 className="text-2xl font-bold text-center mb-3 text-gray-800">
          Let&apos;s start simple
        </h2>

        <p className="text-center text-gray-600 mb-8">
          What&apos;s your annual income? (Total income per year)
        </p>

        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-700">
              RM
            </span>
            <input
              type="text"
              value={formatNumber(income)}
              onChange={handleChange}
              placeholder="60,000"
              className="w-full pl-16 pr-4 py-4 text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">
            💡 <strong>Don't worry</strong> We do not keep your data!
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!income}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </motion.button>

        <button
          onClick={onBack}
          className="w-full text-gray-600 font-semibold py-3 mt-2 hover:text-gray-800 transition-colors"
        >
          ← Back
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Common ranges:</p>
          <div className="flex gap-2 justify-center mt-2">
            <button
              onClick={() => setIncome('60000')}
              className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              RM60k
            </button>
            <button
              onClick={() => setIncome('84000')}
              className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              RM84k
            </button>
            <button
              onClick={() => setIncome('120000')}
              className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              RM120k
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
