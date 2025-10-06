import type { UnitCategory, CustomCategory } from "../types";

// Helper function for creating units
const u = (id: string, label: string, symbol: string | undefined, factorToBase: number) => ({
  id,
  label,
  symbol,
  toBase: (x: number) => x * factorToBase,
  fromBase: (x: number) => x / factorToBase,
});

export const financeCategories: UnitCategory[] = [
  {
    id: "interest-rates",
    group: "Finance",
    name: "Interest Rates",
    description: "Annual, monthly, daily rates and APR conversions",
    icon: "Percent",
    baseUnit: "annual",
    units: [
      u("annual", "Annual Rate", "APR", 1),
      u("monthly", "Monthly Rate", "/month", 12),
      u("quarterly", "Quarterly Rate", "/quarter", 4),
      u("daily", "Daily Rate", "/day", 365),
      u("weekly", "Weekly Rate", "/week", 52),
      u("semi-annual", "Semi-Annual Rate", "/6mo", 2),
      u("bps", "Basis Points", "bps", 10000), // 1% = 100 bps
    ],
    popularPairs: [["annual","monthly"],["bps","annual"],["quarterly","annual"]],
  },
  {
    id: "financial-ratios",
    group: "Finance", 
    name: "Financial Ratios",
    description: "P/E, P/B, ROI, ROE and other financial metrics",
    icon: "Calculator",
    baseUnit: "ratio",
    units: [
      u("ratio", "Simple Ratio", "x", 1),
      u("percentage", "Percentage", "%", 0.01),
      u("decimal", "Decimal", "dec", 1),
      u("bps", "Basis Points", "bps", 0.0001),
      u("multiple", "Multiple (x times)", "×", 1),
      u("percent-change", "Percent Change", "Δ%", 0.01),
    ],
    popularPairs: [["ratio","percentage"],["bps","percentage"],["decimal","percentage"]],
  },
];

export const financeCustomCategories: CustomCategory[] = [
  { id: "currency", group: "Finance", name: "Currency (Live)", description: "Live FX with base selection and caching", icon: "Coins", custom: true },
  { id: "compound-interest", group: "Finance", name: "Compound Interest", description: "Calculate compound interest, future value, and growth", icon: "TrendingUp", custom: true },
  { id: "loan-calculator", group: "Finance", name: "Loan Calculator", description: "Monthly payments, total interest, amortization schedules", icon: "CreditCard", custom: true },
  { id: "investment-returns", group: "Finance", name: "Investment Returns", description: "ROI, CAGR, annualized returns calculator", icon: "LineChart", custom: true },
  { id: "retirement-planning", group: "Finance", name: "Retirement Planning", description: "401k, pension, retirement savings calculator", icon: "PiggyBank", custom: true },
  { id: "mortgage-calculator", group: "Finance", name: "Mortgage Calculator", description: "Monthly payments, amortization, refinancing analysis", icon: "Home", custom: true },
  { id: "tax-calculator", group: "Finance", name: "Tax Calculator", description: "Income tax, capital gains, tax-adjusted returns", icon: "Receipt", custom: true },
  { id: "business-valuation", group: "Finance", name: "Business Valuation", description: "DCF, P/E multiples, enterprise value calculations", icon: "Building", custom: true },
  { id: "bond-calculator", group: "Finance", name: "Bond Calculator", description: "Yield to maturity, duration, present value of bonds", icon: "FileText", custom: true },
  { id: "options-pricing", group: "Finance", name: "Options Pricing", description: "Black-Scholes, Greeks, option value calculator", icon: "Target", custom: true },
  { id: "forex-calculator", group: "Finance", name: "Forex Calculator", description: "Pip values, position sizing, margin requirements", icon: "Globe", custom: true },
  { id: "break-even", group: "Finance", name: "Break-Even Analysis", description: "Fixed costs, variable costs, break-even point", icon: "BarChart3", custom: true },
  { id: "cash-flow", group: "Finance", name: "Cash Flow Analysis", description: "NPV, IRR, payback period calculations", icon: "ArrowRightLeft", custom: true },
  { id: "inflation-calculator", group: "Finance", name: "Inflation Calculator", description: "Real vs nominal values, purchasing power over time", icon: "TrendingDown", custom: true },
  { id: "portfolio-analyzer", group: "Finance", name: "Portfolio Analyzer", description: "Diversification, risk metrics, Sharpe ratio", icon: "PieChart", custom: true },
];