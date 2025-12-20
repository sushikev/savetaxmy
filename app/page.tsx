'use client';

import { useState, useEffect } from 'react';
import { AppState, ClaimedRelief, TaxCalculation } from '@/types';
import { taxReliefs } from '@/data/reliefs';
import { calculateTax } from '@/lib/taxCalculator';
import WelcomeScreen from '@/components/WelcomeScreen';
import IncomeInput from '@/components/IncomeInput';
import SwipeScreen from '@/components/SwipeScreen';
import AmountCollection from '@/components/AmountCollection';
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
    const claimedReliefs = taxReliefs.filter(
      (relief) => swipedData[relief.id] === 'right'
    );

    if (claimedReliefs.length === 0) {
      // No reliefs claimed, go straight to results with zero reliefs
      const calculation = calculateTax(appState.income, []);
      setAppState((prev) => ({
        ...prev,
        swipedCards: swipedData,
        calculation,
        currentStep: 'results',
      }));
    } else {
      setAppState((prev) => ({
        ...prev,
        swipedCards: swipedData,
        reliefAmounts: swipeAmounts || {},
        currentStep: 'amounts',
      }));
    }
  };

  const handleAmountsComplete = (amounts: { [key: string]: number }) => {
    // Merge amounts from swipe and amounts collection
    const finalAmounts = { ...appState.reliefAmounts, ...amounts };

    const claimedReliefs: ClaimedRelief[] = taxReliefs
      .filter((relief) => appState.swipedCards[relief.id] === 'right')
      .map((relief) => ({
        relief,
        amount: finalAmounts[relief.id] || relief.commonAmount,
        claimed: true,
      }));

    const calculation = calculateTax(appState.income, claimedReliefs);

    setAppState((prev) => ({
      ...prev,
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

  const handleBackFromAmounts = () => {
    setAppState((prev) => ({ ...prev, currentStep: 'swipe' }));
  };

  const handleBackFromResults = () => {
    // Go back to amounts if there were reliefs, otherwise to swipe
    const hasReliefs = Object.keys(appState.swipedCards).some(
      (key) => appState.swipedCards[key] === 'right'
    );
    setAppState((prev) => ({
      ...prev,
      currentStep: hasReliefs ? 'amounts' : 'swipe',
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

    case 'amounts':
      const claimedReliefs = taxReliefs.filter(
        (relief) => appState.swipedCards[relief.id] === 'right'
      );
      return (
        <AmountCollection
          claimedReliefs={claimedReliefs}
          onComplete={handleAmountsComplete}
          onBack={handleBackFromAmounts}
          initialAmounts={appState.reliefAmounts}
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
