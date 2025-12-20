export interface TaxRelief {
  id: string;
  category: string;
  title: string;
  icon: string;
  description: string;
  examples: string[];
  maxAmount: number;
  commonAmount: number;
  priority: number;
  tips: string;
}

export interface ClaimedRelief {
  relief: TaxRelief;
  amount: number;
  claimed: boolean;
}

export interface TaxCalculation {
  income: number;
  totalReliefs: number;
  chargeableIncome: number;
  taxPayable: number;
  taxWithoutReliefs: number;
  estimatedRefund: number;
  claimedReliefs: ClaimedRelief[];
}

export interface AppState {
  income: number;
  currentCardIndex: number;
  swipedCards: { [key: string]: 'left' | 'right' };
  reliefAmounts: { [key: string]: number };
  currentStep: 'welcome' | 'income' | 'swipe' | 'amounts' | 'results';
  calculation?: TaxCalculation;
}
