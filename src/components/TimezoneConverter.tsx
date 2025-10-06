import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Combobox } from "./ui/combobox";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Copy, RefreshCcw, Globe2, Clock, ArrowUpDown } from "lucide-react";

interface TimeZone {
  id: string;
  name: string;
  utcOffset: number; // offset in hours
  cities: string[];
}

const timeZones: TimeZone[] = [
  { id: "utc", name: "UTC (Coordinated Universal Time)", utcOffset: 0, cities: ["London", "Dublin"] },
  { id: "est", name: "EST (Eastern Standard Time)", utcOffset: -5, cities: ["New York", "Miami", "Toronto"] },
  { id: "cst", name: "CST (Central Standard Time)", utcOffset: -6, cities: ["Chicago", "Dallas", "Mexico City"] },
  { id: "mst", name: "MST (Mountain Standard Time)", utcOffset: -7, cities: ["Denver", "Phoenix", "Calgary"] },
  { id: "pst", name: "PST (Pacific Standard Time)", utcOffset: -8, cities: ["Los Angeles", "San Francisco", "Vancouver"] },
  { id: "gmt", name: "GMT (Greenwich Mean Time)", utcOffset: 0, cities: ["London", "Dublin", "Lisbon"] },
  { id: "cet", name: "CET (Central European Time)", utcOffset: 1, cities: ["Berlin", "Paris", "Rome"] },
  { id: "eet", name: "EET (Eastern European Time)", utcOffset: 2, cities: ["Athens", "Helsinki", "Cairo"] },
  { id: "msk", name: "MSK (Moscow Standard Time)", utcOffset: 3, cities: ["Moscow", "Istanbul", "Riyadh"] },
  { id: "ist", name: "IST (India Standard Time)", utcOffset: 5.5, cities: ["Mumbai", "Delhi", "Bangalore"] },
  { id: "cst-asia", name: "CST (China Standard Time)", utcOffset: 8, cities: ["Beijing", "Shanghai", "Hong Kong"] },
  { id: "jst", name: "JST (Japan Standard Time)", utcOffset: 9, cities: ["Tokyo", "Osaka", "Seoul"] },
  { id: "aest", name: "AEST (Australian Eastern Standard)", utcOffset: 10, cities: ["Sydney", "Melbourne", "Brisbane"] },
  { id: "nzst", name: "NZST (New Zealand Standard)", utcOffset: 12, cities: ["Auckland", "Wellington"] },
  { id: "hst", name: "HST (Hawaii Standard Time)", utcOffset: -10, cities: ["Honolulu", "Hilo"] },
  { id: "akst", name: "AKST (Alaska Standard Time)", utcOffset: -9, cities: ["Anchorage", "Juneau"] },
];

function formatTime(hours: number, minutes: number = 0): string {
  const totalMinutes = hours * 60 + minutes;
  const h = Math.floor(totalMinutes / 60);
  const m = Math.abs(totalMinutes % 60);
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function parseTimeInput(input: string): { hours: number; minutes: number } | null {
  const timeRegex = /^(\d{1,2}):?(\d{0,2})$/;
  const match = input.match(timeRegex);
  
  if (!match) return null;
  
  const hours = parseInt(match[1]);
  const minutes = match[2] ? parseInt(match[2]) : 0;
  
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  
  return { hours, minutes };
}

function convertTime(time: { hours: number; minutes: number }, fromOffset: number, toOffset: number): { hours: number; minutes: number } {
  // Convert to UTC first
  const utcHours = time.hours - fromOffset;
  const utcMinutes = time.minutes;
  
  // Then convert to target timezone
  const targetHours = utcHours + toOffset;
  const targetMinutes = utcMinutes;
  
  // Handle day overflow/underflow
  let normalizedHours = targetHours;
  while (normalizedHours < 0) normalizedHours += 24;
  while (normalizedHours >= 24) normalizedHours -= 24;
  
  return { hours: normalizedHours, minutes: targetMinutes };
}

export function TimezoneConverter() {
  const [timeInput, setTimeInput] = useState("12:00");
  const [fromZone, setFromZone] = useState("utc");
  const [toZone, setToZone] = useState("est");

  const fromTimeZone = timeZones.find(tz => tz.id === fromZone);
  const toTimeZone = timeZones.find(tz => tz.id === toZone);

  const convertedTime = useMemo(() => {
    const parsedTime = parseTimeInput(timeInput);
    if (!parsedTime || !fromTimeZone || !toTimeZone) return null;

    return convertTime(parsedTime, fromTimeZone.utcOffset, toTimeZone.utcOffset);
  }, [timeInput, fromTimeZone, toTimeZone]);

  const copy = async () => {
    if (!convertedTime) return;
    await navigator.clipboard.writeText(formatTime(convertedTime.hours, convertedTime.minutes));
  };

  const getCurrentTime = () => {
    const now = new Date();
    setTimeInput(formatTime(now.getHours(), now.getMinutes()));
  };

  const popularConversions = [
    { from: "utc", to: "est", label: "UTC → EST" },
    { from: "est", to: "pst", label: "EST → PST" },
    { from: "cet", to: "utc", label: "CET → UTC" },
    { from: "jst", to: "est", label: "JST → EST" },
    { from: "ist", to: "utc", label: "IST → UTC" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Globe2 className="size-4" />
          </span>
          Time Zone Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-[1fr,auto,1fr] sm:items-end">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">From</div>
            <div className="flex items-center gap-2">
              <Input
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                placeholder="HH:MM (24h format)"
              />
              <Combobox
                options={timeZones.map(tz => ({
                  value: tz.id,
                  label: `${tz.name} (${tz.utcOffset >= 0 ? '+' : ''}${tz.utcOffset}h)`
                }))}
                value={fromZone}
                onValueChange={setFromZone}
                placeholder="Search timezone..."
                searchPlaceholder="Search timezones..."
                emptyMessage="No timezone found."
                className="w-[180px]"
              />
            </div>
          </div>

          <div className="hidden sm:flex items-center justify-center pb-2">
            <Button type="button" variant="outline" size="icon" className="rounded-full cursor-pointer" onClick={() => { 
              const tempZone = fromZone; 
              setFromZone(toZone); 
              setToZone(tempZone); 
            }}>
              <ArrowUpDown className="size-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">To</div>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={convertedTime ? formatTime(convertedTime.hours, convertedTime.minutes) : ""}
                className={!convertedTime ? "text-muted-foreground" : ""}
              />
              <Combobox
                options={timeZones.map(tz => ({
                  value: tz.id,
                  label: `${tz.name} (${tz.utcOffset >= 0 ? '+' : ''}${tz.utcOffset}h)`
                }))}
                value={toZone}
                onValueChange={setToZone}
                placeholder="Search timezone..."
                searchPlaceholder="Search timezones..."
                emptyMessage="No timezone found."
                className="w-[180px]"
              />
            </div>
          </div>
        </div>

        {fromTimeZone && toTimeZone && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">From</div>
              <div className="font-medium">{fromTimeZone.name}</div>
              <div className="text-muted-foreground">
                Cities: {fromTimeZone.cities.join(', ')}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">To</div>
              <div className="font-medium">{toTimeZone.name}</div>
              <div className="text-muted-foreground">
                Cities: {toTimeZone.cities.join(', ')}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={() => setTimeInput("12:00")}>
            <RefreshCcw className="mr-2 size-4" />
            Reset
          </Button>
          <Button type="button" variant="outline" onClick={getCurrentTime}>
            <Clock className="mr-2 size-4" />
            Now
          </Button>
          <Button type="button" variant="outline" onClick={copy} disabled={!convertedTime}>
            <Copy className="mr-2 size-4" />
            Copy result
          </Button>
        </div>

        <div>
          <Separator className="my-2" />
          <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Popular conversions</div>
          <div className="flex flex-wrap gap-2">
            {popularConversions.map((conv) => (
              <Badge
                key={`${conv.from}-${conv.to}`}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/15 hover:text-primary"
                onClick={() => {
                  setFromZone(conv.from);
                  setToZone(conv.to);
                }}
              >
                {conv.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}