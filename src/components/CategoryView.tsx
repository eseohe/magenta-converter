import type { Category, UnitCategory } from "../types";
import { UnitConverter } from "./UnitConverter";
import { NumericBaseConverter } from "./NumericBaseConverter";
import { CurrencyConverter } from "./CurrencyConverter";
import { ColorConverter } from "./ColorConverter";
import { TimezoneConverter } from "./TimezoneConverter";
import { ScreenResolutionConverter } from "./ScreenResolutionConverter";

export function CategoryView({ category }: { category: Category }) {
  if ((category as any).custom) {
    if (category.id === "numbers") return <NumericBaseConverter />;
    if (category.id === "currency") return <CurrencyConverter />;
    if (category.id === "colors") return <ColorConverter />;
    if (category.id === "timezones") return <TimezoneConverter />;
    if (category.id === "screen-resolution") return <ScreenResolutionConverter />;
    return null;
  }
  return <UnitConverter category={category as UnitCategory} />;
}
