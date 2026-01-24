'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { TaxRelief } from '@/types';

interface SwipeCardProps {
  relief: TaxRelief;
  onSwipe: (direction: 'left' | 'right', amount?: number) => void;
  exitDirection?: 'left' | 'right' | null;
  style?: React.CSSProperties;
  showAmountInput?: boolean;
  initialAmount?: number;
}

export default function SwipeCard({ relief, onSwipe, exitDirection, style, showAmountInput = false, initialAmount }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(initialAmount ?? relief.maxAmount);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      setExitX(info.offset.x > 0 ? 300 : -300);
      onSwipe(info.offset.x > 0 ? 'right' : 'left', showAmountInput ? currentAmount : undefined);
    }
  };

  const handleSliderChange = (value: number) => {
    setCurrentAmount(value);
  };

  const handleTextInput = (value: string) => {
    // Remove any non-numeric characters except empty string
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue === '') {
      setCurrentAmount(0);
      return;
    }

    const amount = parseInt(numericValue);
    // Cap at maximum relief
    const cappedAmount = Math.min(amount, relief.maxAmount);
    setCurrentAmount(cappedAmount);
  };

  // Calculate exit position based on exitDirection prop or exitX state
  const getExitX = () => {
    if (exitDirection) {
      return exitDirection === 'right' ? 300 : -300;
    }
    return exitX;
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        ...style,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: getExitX() }}
      exit={{ x: getExitX(), opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute w-full max-w-[90%] sm:max-w-[400px] cursor-grab active:cursor-grabbing touch-manipulation"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-6 select-none relative overflow-hidden">
        {/* Exit Animations - Big X and Checkmark */}
        {exitDirection && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            {exitDirection === 'left' ? (
              <div className="text-[200px] leading-none font-bold text-red-500" style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}>
                ✕
              </div>
            ) : (
              <div className="text-[200px] leading-none font-bold text-green-500" style={{ textShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}>
                ✓
              </div>
            )}
          </motion.div>
        )}

        {/* Swipe Indicators */}
        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none z-10">
          <motion.div
            style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
            className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm"
          >
            SKIP
          </motion.div>
          <motion.div
            style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
            className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm"
          >
            CLAIM
          </motion.div>
        </div>

        {/* Card Content - Scrollable */}
        <div className="mt-12 max-h-[calc(100vh-280px)] overflow-y-auto overscroll-contain">
          <div className="text-7xl text-center mb-4">{relief.icon}</div>

          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
              {relief.category}
            </span>
          </div>

          <h3 className="text-2xl font-bold mb-3 text-gray-800">
            {relief.title}
          </h3>

          <p className="text-gray-600 mb-4 leading-relaxed">
            {relief.description}
          </p>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
            <div className="text-sm text-green-700 font-semibold mb-1">
              {relief.id === 'individual_self' ? 'Automatically applied ✅' : 'Maximum Relief'}
            </div>
            <div className="text-3xl font-bold text-green-600">
              RM{relief.maxAmount.toLocaleString()}
            </div>
          </div>

          {relief.examples.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Examples:
              </div>
              <ul className="space-y-1">
                {relief.examples.map((example, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              💡 <strong>Tip:</strong> {relief.tips}
            </p>
          </div>

          {/* Amount Input Section */}
          {showAmountInput && (
            <div
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <div className="mt-4 pt-4 border-t-2 border-gray-200">
              <div className="text-center mb-3">
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  How much did you spend?
                </div>

                {/* Text Input for Direct Entry */}
                <div className="relative max-w-xs mx-auto mb-3">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400 pointer-events-none">
                    RM
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={currentAmount === 0 ? '' : currentAmount.toString()}
                    onChange={(e) => handleTextInput(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    placeholder="0"
                    className="w-full text-3xl font-bold text-green-600 text-center border-2 border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-green-500 transition-colors"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Max: RM{relief.maxAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleSliderChange(0); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex-1 px-2 py-1.5 bg-gray-100 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                >
                  RM0
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleSliderChange(Math.round(relief.maxAmount * 0.25)); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex-1 px-2 py-1.5 bg-gray-100 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                >
                  25%
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleSliderChange(Math.round(relief.maxAmount * 0.5)); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex-1 px-2 py-1.5 bg-gray-100 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                >
                  50%
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleSliderChange(Math.round(relief.maxAmount * 0.75)); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex-1 px-2 py-1.5 bg-gray-100 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                >
                  75%
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleSliderChange(relief.maxAmount); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex-1 px-2 py-1.5 bg-green-100 rounded-lg text-xs hover:bg-green-200 transition-colors font-semibold text-green-700"
                >
                  Max
                </button>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
