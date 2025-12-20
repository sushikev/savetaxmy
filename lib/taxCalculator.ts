import { ClaimedRelief, TaxCalculation } from '@/types';

// 2025 Malaysian Tax Brackets
const TAX_BRACKETS = [
  { min: 0, max: 5000, rate: 0 },
  { min: 5001, max: 20000, rate: 0.01 },
  { min: 20001, max: 35000, rate: 0.03 },
  { min: 35001, max: 50000, rate: 0.06 },
  { min: 50001, max: 70000, rate: 0.11 },
  { min: 70001, max: 100000, rate: 0.19 },
  { min: 100001, max: 400000, rate: 0.25 },
  { min: 400001, max: 600000, rate: 0.26 },
  { min: 600001, max: 2000000, rate: 0.28 },
  { min: 2000001, max: Infinity, rate: 0.30 },
];

function calculateTaxOnIncome(income: number): number {
  let tax = 0;
  let remainingIncome = income;

  for (const bracket of TAX_BRACKETS) {
    if (remainingIncome <= 0) break;

    const bracketRange = bracket.max - bracket.min + 1;
    const taxableInBracket = Math.min(remainingIncome, bracketRange);

    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return Math.round(tax * 100) / 100;
}

export function calculateTax(
  income: number,
  claimedReliefs: ClaimedRelief[]
): TaxCalculation {
  // Step 1: Calculate total reliefs
  const totalReliefs = claimedReliefs
    .filter((r) => r.claimed)
    .reduce((sum, r) => sum + r.amount, 0);

  // Step 2: Calculate chargeable income
  const chargeableIncome = Math.max(0, income - totalReliefs);

  // Step 3: Calculate tax with reliefs
  const taxPayable = calculateTaxOnIncome(chargeableIncome);

  // Step 4: Calculate tax without reliefs (for refund estimate)
  const taxWithoutReliefs = calculateTaxOnIncome(income);

  // Step 5: Estimate refund
  const estimatedRefund = Math.max(0, taxWithoutReliefs - taxPayable);

  return {
    income,
    totalReliefs,
    chargeableIncome,
    taxPayable,
    taxWithoutReliefs,
    estimatedRefund,
    claimedReliefs,
  };
}

export function formatCurrency(amount: number): string {
  return `RM${amount.toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCurrencyShort(amount: number): string {
  return `RM${amount.toLocaleString('en-MY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
