'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaxRelief } from '@/types';
import SwipeCard from './SwipeCard';

interface SwipeScreenProps {
  reliefs: TaxRelief[];
  onComplete: (swipedData: { [key: string]: 'left' | 'right' }, amounts?: { [key: string]: number }) => void;
  onBack: () => void;
}

export default function SwipeScreen({ reliefs, onComplete, onBack }: SwipeScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedCards, setSwipedCards] = useState<{ [key: string]: 'left' | 'right' }>({});
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});
  const [showTutorial, setShowTutorial] = useState(true);
  const [exitingCard, setExitingCard] = useState<{ relief: TaxRelief; direction: 'left' | 'right' } | null>(null);

  const handleSwipe = (direction: 'left' | 'right', amount?: number) => {
    const currentRelief = reliefs[currentIndex];
    const newSwipedCards = {
      ...swipedCards,
      [currentRelief.id]: direction,
    };

    setSwipedCards(newSwipedCards);
    setExitingCard({ relief: currentRelief, direction });

    // Auto-apply full amount for certain reliefs when swiped right
    let finalAmount = amount;
    const autoAppliedReliefs = ['individual_self', 'disabled_spouse', 'child_under_18', 'child_disabled'];
    if (autoAppliedReliefs.includes(currentRelief.id) && direction === 'right') {
      finalAmount = currentRelief.maxAmount;
    }

    // Store amount if provided and direction is 'right' (claimed)
    if (finalAmount !== undefined && direction === 'right') {
      setAmounts({
        ...amounts,
        [currentRelief.id]: finalAmount,
      });
    }

    if (currentIndex < reliefs.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setExitingCard(null);
      }, 300);
    } else {
      setTimeout(() => {
        const finalAmountsForComplete = finalAmount !== undefined && direction === 'right'
          ? { ...amounts, [currentRelief.id]: finalAmount }
          : amounts;
        onComplete(newSwipedCards, finalAmountsForComplete);
      }, 300);
    }
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
  };

  if (showTutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="text-5xl text-center mb-6">💝</div>

          <h2 className="text-2xl font-bold text-center mb-3 text-gray-800">
            Swipe Like Tinder
          </h2>

          <p className="text-center text-gray-600 mb-8">
            Let&apos;s find tax reliefs you can claim!
          </p>

          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">
                →
              </div>
              <div>
                <div className="font-bold text-gray-800">Swipe Right</div>
                <div className="text-sm text-gray-600">I have this expense / I qualify</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl">
                ←
              </div>
              <div>
                <div className="font-bold text-gray-800">Swipe Left</div>
                <div className="text-sm text-gray-600">Not applicable to me</div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSkipTutorial}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            Got it! Let&apos;s Start
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / reliefs.length) * 100;
  const cardsRemaining = reliefs.length - currentIndex;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
      {/* Progress Bar */}
      <div className="sticky top-0 bg-white shadow-sm p-4 z-40">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Card {currentIndex + 1} of {reliefs.length}</span>
            <span>{cardsRemaining} remaining</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 flex items-center justify-center p-4 pb-48 relative">
        <AnimatePresence mode="popLayout">
          {exitingCard && (
            <SwipeCard
              key={`exiting-${exitingCard.relief.id}`}
              relief={exitingCard.relief}
              onSwipe={() => {}}
              exitDirection={exitingCard.direction}
              showAmountInput={!['individual_self', 'disabled_spouse', 'child_under_18', 'child_disabled'].includes(exitingCard.relief.id)}
              style={{
                zIndex: reliefs.length,
              }}
            />
          )}
          {!exitingCard && reliefs.slice(currentIndex, currentIndex + 2).map((relief, idx) => {
            const reliefIndex = currentIndex + idx;
            return (
              <SwipeCard
                key={`current-${relief.id}`}
                relief={relief}
                onSwipe={idx === 0 ? handleSwipe : () => {}}
                exitDirection={null}
                showAmountInput={!['individual_self', 'disabled_spouse', 'child_under_18', 'child_disabled'].includes(relief.id)}
                initialAmount={amounts[relief.id]}
                style={{
                  zIndex: reliefs.length - idx,
                  scale: idx === 0 ? 1 : 0.95,
                  filter: idx === 0 ? 'none' : 'blur(4px)',
                  opacity: idx === 0 ? 1 : 0.25,
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Button Controls - Fixed at bottom for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom shadow-lg z-50">
        <div className="max-w-md mx-auto">
          <div className="flex gap-3 items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSwipe('left')}
              className="flex-1 bg-red-100 text-red-600 font-bold py-3 px-4 rounded-xl hover:bg-red-200 transition-colors text-sm"
            >
              ← Skip
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors text-sm"
            >
              Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSwipe('right')}
              className="flex-1 bg-green-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-600 transition-colors shadow-lg text-sm"
            >
              {reliefs[currentIndex]?.id === 'individual_self' ? 'Next →' : 'Claim →'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
