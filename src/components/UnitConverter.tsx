import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ArrowUpDown, Copy, RefreshCcw } from "lucide-react";
import type { UnitCategory } from "../types";
import { convert } from "../lib/convert";
import { formatNumber } from "../lib/format";

export function UnitConverter({ category }: { category: UnitCategory }) {
  const [from, setFrom] = useState(category.units[0].id);
  const [to, setTo] = useState(category.units[1]?.id ?? category.units[0].id);
  const [input, setInput] = useState<string>("1");

  const parsed = Number.parseFloat(input.replace(/,/g, ""));
  const result = useMemo(() => {
    if (!Number.isFinite(parsed)) return NaN;
    try {
      return convert(parsed, category, from, to);
    } catch (e) {
      return NaN;
    }
  }, [parsed, category, from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const copy = async () => {
    if (!Number.isFinite(result)) return;
    await navigator.clipboard.writeText(String(result));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">{category.name[0]}</span>
          {category.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-[1fr,auto,1fr] sm:items-end">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">From</div>
            <div className="flex items-center gap-2">
              <Input inputMode="decimal" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter value" />
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {category.units.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.label}{u.symbol ? ` (${u.symbol})` : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden sm:flex items-center justify-center pb-2">
            <Button type="button" variant="outline" size="icon" className="rounded-full cursor-pointer" onClick={swap}>
              <ArrowUpDown className="size-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">To</div>
            <div className="flex items-center gap-2">
              <Input readOnly value={Number.isFinite(result) ? formatNumber(result) : ""} />
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {category.units.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.label}{u.symbol ? ` (${u.symbol})` : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={() => setInput("1")}><RefreshCcw className="mr-2 size-4"/>Reset</Button>
          <Button type="button" variant="outline" onClick={copy}><Copy className="mr-2 size-4"/>Copy result</Button>
        </div>

        {category.popularPairs && category.popularPairs.length > 0 && (
          <div>
            <Separator className="my-2" />
            <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Popular pairs</div>
            <div className="flex flex-wrap gap-2">
              {category.popularPairs.map(([a,b]) => (
                <Badge key={`${a}-${b}`} variant="secondary" className="cursor-pointer hover:bg-primary/15 hover:text-primary" onClick={() => { setFrom(a); setTo(b); }}>
                  {category.units.find(u=>u.id===a)?.symbol ?? category.units.find(u=>u.id===a)?.label}
                  <span className="mx-1">→</span>
                  {category.units.find(u=>u.id===b)?.symbol ?? category.units.find(u=>u.id===b)?.label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
