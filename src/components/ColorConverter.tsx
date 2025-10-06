import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Copy, RefreshCcw, Palette } from "lucide-react";

type ColorFormat = "hex" | "rgb" | "hsl" | "cmyk";

interface ColorValue {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  cmyk: [number, number, number, number];
}

// Color conversion utilities
function hexToRgb(hex: string): [number, number, number] | null {
  const cleaned = hex.replace('#', '');
  if (!/^[0-9A-Fa-f]{6}$/.test(cleaned)) return null;
  
  const r = parseInt(cleaned.substr(0, 2), 16);
  const g = parseInt(cleaned.substr(2, 2), 16);
  const b = parseInt(cleaned.substr(4, 2), 16);
  
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  if (diff !== 0) {
    if (max === r) h = ((g - b) / diff) % 6;
    else if (max === g) h = (b - r) / diff + 2;
    else h = (r - g) / diff + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  
  const l = (max + min) / 2;
  const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));
  
  return [h, Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  r /= 255; g /= 255; b /= 255;
  
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return [0, 0, 0, 100];
  
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  
  return [
    Math.round(c * 100),
    Math.round(m * 100),
    Math.round(y * 100),
    Math.round(k * 100)
  ];
}

function cmykToRgb(c: number, m: number, y: number, k: number): [number, number, number] {
  c /= 100; m /= 100; y /= 100; k /= 100;
  
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  
  return [Math.round(r), Math.round(g), Math.round(b)];
}

function parseColorInput(input: string, format: ColorFormat): ColorValue | null {
  try {
    switch (format) {
      case "hex": {
        const rgb = hexToRgb(input);
        if (!rgb) return null;
        const [r, g, b] = rgb;
        return {
          hex: rgbToHex(r, g, b),
          rgb: [r, g, b],
          hsl: rgbToHsl(r, g, b),
          cmyk: rgbToCmyk(r, g, b)
        };
      }
      
      case "rgb": {
        const match = input.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)|(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (!match) return null;
        
        const r = parseInt(match[1] || match[4]);
        const g = parseInt(match[2] || match[5]);
        const b = parseInt(match[3] || match[6]);
        
        if (r > 255 || g > 255 || b > 255) return null;
        
        return {
          hex: rgbToHex(r, g, b),
          rgb: [r, g, b],
          hsl: rgbToHsl(r, g, b),
          cmyk: rgbToCmyk(r, g, b)
        };
      }
      
      case "hsl": {
        const match = input.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)|(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (!match) return null;
        
        const h = parseInt(match[1] || match[4]);
        const s = parseInt(match[2] || match[5]);
        const l = parseInt(match[3] || match[6]);
        
        if (h >= 360 || s > 100 || l > 100) return null;
        
        const rgb = hslToRgb(h, s, l);
        const [r, g, b] = rgb;
        
        return {
          hex: rgbToHex(r, g, b),
          rgb,
          hsl: [h, s, l],
          cmyk: rgbToCmyk(r, g, b)
        };
      }
      
      case "cmyk": {
        const match = input.match(/cmyk\(\s*(\d+)%?\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)|(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (!match) return null;
        
        const c = parseInt(match[1] || match[5]);
        const m = parseInt(match[2] || match[6]);
        const y = parseInt(match[3] || match[7]);
        const k = parseInt(match[4] || match[8]);
        
        if (c > 100 || m > 100 || y > 100 || k > 100) return null;
        
        const rgb = cmykToRgb(c, m, y, k);
        const [r, g, b] = rgb;
        
        return {
          hex: rgbToHex(r, g, b),
          rgb,
          hsl: rgbToHsl(r, g, b),
          cmyk: [c, m, y, k]
        };
      }
      
      default:
        return null;
    }
  } catch {
    return null;
  }
}

function formatColor(color: ColorValue, format: ColorFormat): string {
  switch (format) {
    case "hex":
      return color.hex;
    case "rgb":
      return `rgb(${color.rgb.join(', ')})`;
    case "hsl":
      return `hsl(${color.hsl[0]}, ${color.hsl[1]}%, ${color.hsl[2]}%)`;
    case "cmyk":
      return `cmyk(${color.cmyk.join('%, ')}%)`;
  }
}

export function ColorConverter() {
  const [input, setInput] = useState("#ff6b9d");
  const [fromFormat, setFromFormat] = useState<ColorFormat>("hex");
  const [toFormat, setToFormat] = useState<ColorFormat>("rgb");

  const color = useMemo(() => parseColorInput(input, fromFormat), [input, fromFormat]);

  const copy = async () => {
    if (!color) return;
    await navigator.clipboard.writeText(formatColor(color, toFormat));
  };

  const popularColors = [
    { name: "Magenta", hex: "#ff006e" },
    { name: "Hot Pink", hex: "#ff6b9d" },
    { name: "Purple", hex: "#8338ec" },
    { name: "Blue", hex: "#3a86ff" },
    { name: "Cyan", hex: "#06ffa5" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Palette className="size-4" />
          </span>
          Color Codes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-[1fr,auto,1fr] sm:items-end">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">From</div>
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter color value"
              />
              <Select value={fromFormat} onValueChange={(v) => setFromFormat(v as ColorFormat)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hex">HEX</SelectItem>
                  <SelectItem value="rgb">RGB</SelectItem>
                  <SelectItem value="hsl">HSL</SelectItem>
                  <SelectItem value="cmyk">CMYK</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden sm:flex items-center justify-center pb-2">
            {color && (
              <div
                className="size-8 rounded border border-border"
                style={{ backgroundColor: color.hex }}
                title="Color preview"
              />
            )}
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">To</div>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={color ? formatColor(color, toFormat) : ""}
                className={!color ? "text-muted-foreground" : ""}
              />
              <Select value={toFormat} onValueChange={(v) => setToFormat(v as ColorFormat)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hex">HEX</SelectItem>
                  <SelectItem value="rgb">RGB</SelectItem>
                  <SelectItem value="hsl">HSL</SelectItem>
                  <SelectItem value="cmyk">CMYK</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {color && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">HEX</div>
              <div className="font-mono">{color.hex}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">RGB</div>
              <div className="font-mono">rgb({color.rgb.join(', ')})</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">HSL</div>
              <div className="font-mono">hsl({color.hsl[0]}, {color.hsl[1]}%, {color.hsl[2]}%)</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">CMYK</div>
              <div className="font-mono">cmyk({color.cmyk.join('%, ')}%)</div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={() => setInput("#ff6b9d")}>
            <RefreshCcw className="mr-2 size-4" />
            Reset
          </Button>
          <Button type="button" variant="outline" onClick={copy} disabled={!color}>
            <Copy className="mr-2 size-4" />
            Copy result
          </Button>
        </div>

        <div>
          <Separator className="my-2" />
          <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Popular colors</div>
          <div className="flex flex-wrap gap-2">
            {popularColors.map((c) => (
              <Badge
                key={c.hex}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/15 hover:text-primary flex items-center gap-2"
                onClick={() => setInput(c.hex)}
              >
                <div
                  className="size-3 rounded-full border border-border"
                  style={{ backgroundColor: c.hex }}
                />
                {c.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}