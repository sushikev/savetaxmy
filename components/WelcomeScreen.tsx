'use client';

import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-6xl text-center mb-6"
        >
          💰
        </motion.div>

        <h1 className="text-3xl font-bold text-center mb-3 text-gray-800">
          SaveTax.my
        </h1>

        <p className="text-lg text-center text-gray-600 mb-8">
          Average Users Found RM2,000+ They Were Leaving on the Table. Don't Give Away Your Income.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <h3 className="font-semibold text-gray-800">Discover Hidden Reliefs</h3>
              <p className="text-sm text-gray-600">
                Find tax reliefs you didn&apos;t know existed
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">💝</div>
            <div>
              <h3 className="font-semibold text-gray-800">Swipe Like Tinder</h3>
              <p className="text-sm text-gray-600">
                Fun, fast way to claim your reliefs
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">📱</div>
            <div>
              <h3 className="font-semibold text-gray-800">Mobile-First</h3>
              <p className="text-sm text-gray-600">
                Works best on mobile devices
              </p>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          Start Swiping
        </motion.button>

        <p className="text-xs text-center text-gray-500 mt-6">
          FREE to use • NO signup required
        </p>
      </motion.div>
    </div>
  );
}
