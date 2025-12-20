'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TaxRelief } from '@/types';

interface AmountCollectionProps {
  claimedReliefs: TaxRelief[];
  onComplete: (amounts: { [key: string]: number }) => void;
  onBack: () => void;
  initialAmounts?: { [key: string]: number };
}

// Reliefs that are auto-applied at max amount without user input
const AUTO_APPLIED_RELIEFS = [
  'individual_self',      // Always RM9,000
  'disabled_spouse',      // Always RM6,000
];

export default function AmountCollection({
  claimedReliefs,
  onComplete,
  onBack,
  initialAmounts = {},
}: AmountCollectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [amounts, setAmounts] = useState<{ [key: string]: number }>(initialAmounts);
  const [isSpouseRelief, setIsSpouseRelief] = useState<boolean | null>(null);

  // Filter reliefs that need user input (exclude auto-applied and already-collected amounts)
  const reliefsNeedingInput = claimedReliefs.filter(
    (relief) => !AUTO_APPLIED_RELIEFS.includes(relief.id) && !initialAmounts[relief.id]
  );

  // Auto-apply amounts for certain reliefs on mount
  useEffect(() => {
    const autoAmounts: { [key: string]: number } = { ...initialAmounts };
    claimedReliefs.forEach((relief) => {
      if (AUTO_APPLIED_RELIEFS.includes(relief.id)) {
        autoAmounts[relief.id] = relief.maxAmount;
      }
    });
    setAmounts(autoAmounts);
  }, [claimedReliefs, initialAmounts]);

  // If no reliefs need input, complete immediately
  useEffect(() => {
    if (reliefsNeedingInput.length === 0 && Object.keys(amounts).length > 0) {
      onComplete(amounts);
    }
  }, [amounts, reliefsNeedingInput.length, onComplete]);

  if (reliefsNeedingInput.length === 0) {
    return null; // Will redirect automatically
  }

  const currentRelief = reliefsNeedingInput[currentIndex];
  const currentAmount = amounts[currentRelief.id] ?? currentRelief.maxAmount;

  const handleNext = () => {
    const newAmounts = {
      ...amounts,
      [currentRelief.id]: currentAmount,
    };
    setAmounts(newAmounts);

    if (currentIndex < reliefsNeedingInput.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsSpouseRelief(null); // Reset for next relief
    } else {
      onComplete(newAmounts);
    }
  };

  const handleSkip = () => {
    const newAmounts = {
      ...amounts,
      [currentRelief.id]: currentRelief.commonAmount,
    };
    setAmounts(newAmounts);

    if (currentIndex < reliefsNeedingInput.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsSpouseRelief(null);
    } else {
      onComplete(newAmounts);
    }
  };

  const handleSliderChange = (value: number) => {
    setAmounts({
      ...amounts,
      [currentRelief.id]: value,
    });
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsSpouseRelief(null);
    } else {
      onBack();
    }
  };

  const handleSpouseChoice = (isSpouse: boolean) => {
    setIsSpouseRelief(isSpouse);
    if (isSpouse) {
      // Fixed RM4,000 for spouse
      setAmounts({
        ...amounts,
        [currentRelief.id]: 4000,
      });
    } else {
      // Allow user to set amount for alimony
      setAmounts({
        ...amounts,
        [currentRelief.id]: currentRelief.maxAmount,
      });
    }
  };

  const progress = ((currentIndex + 1) / reliefsNeedingInput.length) * 100;

  // Special handling for spouse/alimony relief
  const isSpouseAlimonyRelief = currentRelief.id === 'spouse_alimony';
  const needsSpouseChoice = isSpouseAlimonyRelief && isSpouseRelief === null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex flex-col">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Relief {currentIndex + 1} of {reliefsNeedingInput.length}</span>
            <span>{reliefsNeedingInput.length - currentIndex} remaining</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <motion.div
          key={currentRelief.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-h-[calc(100vh-200px)] overflow-y-auto my-auto"
        >
          <div className="text-5xl md:text-6xl text-center mb-3">{currentRelief.icon}</div>

          <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-gray-800">
            {currentRelief.title}
          </h2>

          {/* Spouse/Alimony Choice */}
          {needsSpouseChoice ? (
            <div className="space-y-3">
              <p className="text-center text-gray-600 mb-4">
                Which type of relief are you claiming?
              </p>

              <button
                onClick={() => handleSpouseChoice(true)}
                className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-left"
              >
                <div className="font-bold text-gray-800 mb-1">Spouse Relief</div>
                <div className="text-sm text-gray-600">
                  My spouse has no income (Fixed RM4,000)
                </div>
              </button>

              <button
                onClick={() => handleSpouseChoice(false)}
                className="w-full p-3 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition-colors text-left"
              >
                <div className="font-bold text-gray-800 mb-1">Alimony Payment</div>
                <div className="text-sm text-gray-600">
                  Alimony payments to former wife (Enter amount)
                </div>
              </button>

              <button
                onClick={handleBack}
                className="w-full text-gray-600 font-semibold py-2 hover:text-gray-800 transition-colors mt-2"
              >
                ← Back
              </button>
            </div>
          ) : (
            <>
              <p className="text-center text-gray-600 mb-6">
                {isSpouseAlimonyRelief && isSpouseRelief
                  ? 'Spouse relief is fixed at RM4,000'
                  : 'How much did you spend on this?'}
              </p>

              <div className="mb-8">
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-green-600 mb-2">
                    RM{currentAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Maximum: RM{currentRelief.maxAmount.toLocaleString()}
                  </div>
                </div>

                {/* Show slider only if not fixed spouse relief */}
                {!(isSpouseAlimonyRelief && isSpouseRelief) && (
                  <>
                    {/* Slider */}
                    <input
                      type="range"
                      min="0"
                      max={currentRelief.maxAmount}
                      step="100"
                      value={currentAmount}
                      onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #10B981 0%, #10B981 ${(currentAmount / currentRelief.maxAmount) * 100}%, #E5E7EB ${(currentAmount / currentRelief.maxAmount) * 100}%, #E5E7EB 100%)`,
                      }}
                    />

                    {/* Quick Amount Buttons */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleSliderChange(0)}
                        className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        RM0
                      </button>
                      <button
                        onClick={() => handleSliderChange(Math.round(currentRelief.maxAmount * 0.25))}
                        className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        25%
                      </button>
                      <button
                        onClick={() => handleSliderChange(Math.round(currentRelief.maxAmount * 0.5))}
                        className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        50%
                      </button>
                      <button
                        onClick={() => handleSliderChange(Math.round(currentRelief.maxAmount * 0.75))}
                        className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        75%
                      </button>
                      <button
                        onClick={() => handleSliderChange(currentRelief.maxAmount)}
                        className="flex-1 px-3 py-2 bg-green-100 rounded-lg text-sm hover:bg-green-200 transition-colors font-semibold text-green-700"
                      >
                        Max
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  {currentIndex < reliefsNeedingInput.length - 1 ? 'Next' : 'Calculate'}
                </motion.button>

                {!(isSpouseAlimonyRelief && isSpouseRelief) && (
                  <button
                    onClick={handleSkip}
                    className="w-full text-gray-600 font-semibold py-3 hover:text-gray-800 transition-colors"
                  >
                    Skip (use average: RM{currentRelief.commonAmount.toLocaleString()})
                  </button>
                )}

                <button
                  onClick={handleBack}
                  className="w-full text-gray-600 font-semibold py-3 hover:text-gray-800 transition-colors"
                >
                  ← Back
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #10B981;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #10B981;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
