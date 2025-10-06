import type { Category, UnitCategory } from "../types";
import { UnitConverter } from "./UnitConverter";
import { NumericBaseConverter } from "./NumericBaseConverter";
import { CurrencyConverter } from "./CurrencyConverter";
import { ColorConverter } from "./ColorConverter";
import { TimezoneConverter } from "./TimezoneConverter";
import { ScreenResolutionConverter } from "./ScreenResolutionConverter";
import { CompoundInterestConverter } from "./CompoundInterestConverter";
import { LoanCalculatorConverter } from "./LoanCalculatorConverter";
import { MortgageCalculatorConverter } from "./MortgageCalculatorConverter";
import { InvestmentReturnsConverter } from "./InvestmentReturnsConverter";
import { RetirementPlanningConverter } from "./RetirementPlanningConverter";
import { BusinessValuationConverter } from "./BusinessValuationConverter";
import { BondCalculatorConverter } from "./BondCalculatorConverter";
import { BreakEvenConverter } from "./BreakEvenConverter";
import { CashFlowConverter } from "./CashFlowConverter";
import { OptionsPricingConverter } from "./OptionsPricingConverter";
import { PortfolioAnalyzerConverter } from "./PortfolioAnalyzerConverter";
import { TaxCalculatorConverter } from "./TaxCalculatorConverter";
import { ForexCalculatorConverter } from "./ForexCalculatorConverter";
import { InflationCalculatorConverter } from "./InflationCalculatorConverter";
import { BMICalculatorConverter } from "./BMICalculatorConverter";
import { IPSubnetCalculatorConverter } from "./IPSubnetCalculatorConverter";
import { BandwidthCalculatorConverter } from "./BandwidthCalculatorConverter";

export function CategoryView({ category }: { category: Category }) {
  if ((category as any).custom) {
    if (category.id === "numbers") return <NumericBaseConverter />;
    if (category.id === "currency") return <CurrencyConverter />;
    if (category.id === "colors") return <ColorConverter />;
    if (category.id === "timezones") return <TimezoneConverter />;
    if (category.id === "screen-resolution") return <ScreenResolutionConverter />;
    if (category.id === "compound-interest") return <CompoundInterestConverter />;
    if (category.id === "loan-calculator") return <LoanCalculatorConverter />;
    if (category.id === "mortgage-calculator") return <MortgageCalculatorConverter />;
    if (category.id === "investment-returns") return <InvestmentReturnsConverter />;
    if (category.id === "retirement-planning") return <RetirementPlanningConverter />;
    if (category.id === "business-valuation") return <BusinessValuationConverter />;
    if (category.id === "bond-calculator") return <BondCalculatorConverter />;
    if (category.id === "break-even") return <BreakEvenConverter />;
    if (category.id === "cash-flow") return <CashFlowConverter />;
    if (category.id === "options-pricing") return <OptionsPricingConverter />;
    if (category.id === "portfolio-analyzer") return <PortfolioAnalyzerConverter />;
    if (category.id === "tax-calculator") return <TaxCalculatorConverter />;
    if (category.id === "forex-calculator") return <ForexCalculatorConverter />;
    if (category.id === "inflation-calculator") return <InflationCalculatorConverter />;
    if (category.id === "bmi-calculator") return <BMICalculatorConverter />;
    if (category.id === "ip-subnet-calculator") return <IPSubnetCalculatorConverter />;
    if (category.id === "bandwidth-calculator") return <BandwidthCalculatorConverter />;
    return null;
  }
  return <UnitConverter category={category as UnitCategory} />;
}
