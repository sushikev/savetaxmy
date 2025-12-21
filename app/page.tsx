'use client';

import { useState, useEffect } from 'react';
import { AppState, ClaimedRelief, TaxCalculation } from '@/types';
import { taxReliefs } from '@/data/reliefs';
import { calculateTax } from '@/lib/taxCalculator';
import WelcomeScreen from '@/components/WelcomeScreen';
import IncomeInput from '@/components/IncomeInput';
import SwipeScreen from '@/components/SwipeScreen';
import ResultsScreen from '@/components/ResultsScreen';

const STORAGE_KEY = 'taxkaki_state';

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    income: 0,
    currentCardIndex: 0,
    swipedCards: {},
    reliefAmounts: {},
    currentStep: 'welcome',
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setAppState(parsed);
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (appState.currentStep !== 'welcome') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    }
  }, [appState]);

  const handleStart = () => {
    setAppState((prev) => ({ ...prev, currentStep: 'income' }));
  };

  const handleIncomeSubmit = (income: number) => {
    setAppState((prev) => ({
      ...prev,
      income,
      currentStep: 'swipe',
    }));
  };

  const handleSwipeComplete = (swipedData: { [key: string]: 'left' | 'right' }, swipeAmounts?: { [key: string]: number }) => {
    // Build claimed reliefs with amounts from swipe phase
    const finalAmounts = swipeAmounts || {};
    const claimedReliefs: ClaimedRelief[] = taxReliefs
      .filter((relief) => swipedData[relief.id] === 'right')
      .map((relief) => ({
        relief,
        amount: finalAmounts[relief.id] || relief.commonAmount,
        claimed: true,
      }));

    const calculation = calculateTax(appState.income, claimedReliefs);

    setAppState((prev) => ({
      ...prev,
      swipedCards: swipedData,
      reliefAmounts: finalAmounts,
      calculation,
      currentStep: 'results',
    }));
  };

  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAppState({
      income: 0,
      currentCardIndex: 0,
      swipedCards: {},
      reliefAmounts: {},
      currentStep: 'welcome',
    });
  };

  // Back navigation handlers
  const handleBackFromIncome = () => {
    setAppState((prev) => ({ ...prev, currentStep: 'welcome' }));
  };

  const handleBackFromSwipe = () => {
    setAppState((prev) => ({ ...prev, currentStep: 'income' }));
  };

  const handleBackFromResults = () => {
    setAppState((prev) => ({
      ...prev,
      currentStep: 'swipe',
    }));
  };

  // Render current screen
  switch (appState.currentStep) {
    case 'welcome':
      return <WelcomeScreen onStart={handleStart} />;

    case 'income':
      return (
        <IncomeInput
          onSubmit={handleIncomeSubmit}
          onBack={handleBackFromIncome}
        />
      );

    case 'swipe':
      return (
        <SwipeScreen
          reliefs={taxReliefs}
          onComplete={handleSwipeComplete}
          onBack={handleBackFromSwipe}
        />
      );

    case 'results':
      if (!appState.calculation) {
        return null;
      }
      return (
        <ResultsScreen
          calculation={appState.calculation}
          onRestart={handleRestart}
          onBack={handleBackFromResults}
        />
      );

    default:
      return <WelcomeScreen onStart={handleStart} />;
  }
}
