import type { UnitCategory, CustomCategory } from "../types";

const u = (id: string, label: string, symbol: string | undefined, factorToBase: number) => ({
  id,
  label,
  symbol,
  toBase: (x: number) => x * factorToBase,
  fromBase: (x: number) => x / factorToBase,
});

export const digitalCategories: UnitCategory[] = [
  {
    id: "data",
    group: "Digital",
    name: "Data Size",
    description: "Bytes, bits, KB/MB/GB and KiB/MiB/GiB",
    icon: "Database",
    baseUnit: "B",
    units: [
      u("b", "Bit", "b", 1/8),
      u("nibble", "Nibble (4 bits)", "nibble", 0.5),
      u("B", "Byte", "B", 1),
      u("KB", "Kilobyte (10³)", "KB", 1e3),
      u("MB", "Megabyte (10⁶)", "MB", 1e6),
      u("GB", "Gigabyte (10⁹)", "GB", 1e9),
      u("TB", "Terabyte (10¹²)", "TB", 1e12),
      u("KiB", "Kibibyte (2¹⁰)", "KiB", 1024),
      u("MiB", "Mebibyte (2²⁰)", "MiB", 1024 ** 2),
      u("GiB", "Gibibyte (2³⁰)", "GiB", 1024 ** 3),
      u("TiB", "Tebibyte (2⁴⁰)", "TiB", 1024 ** 4),
    ],
    popularPairs: [["MB","MiB"],["GB","GiB"],["B","b"]],
  },
  {
    id: "bandwidth",
    group: "Digital",
    name: "Data Transfer",
    description: "bps, Kbps, Mbps, Gbps and Byte/s",
    icon: "Antenna",
    baseUnit: "bps",
    units: [
      u("bps", "Bit/s", "bps", 1),
      u("Kbps", "Kilobit/s", "Kbps", 1e3),
      u("Mbps", "Megabit/s", "Mbps", 1e6),
      u("Gbps", "Gigabit/s", "Gbps", 1e9),
      u("Bps", "Byte/s", "B/s", 8),
      u("KBps", "Kilobyte/s", "KB/s", 8e3),
      u("MBps", "Megabyte/s", "MB/s", 8e6),
      u("GBps", "Gigabyte/s", "GB/s", 8e9),
    ],
    popularPairs: [["Mbps","MBps"],["Gbps","GBps"],["bps","Kbps"]],
  },
];

export const digitalCustomCategories: CustomCategory[] = [
  { id: "screen-resolution", group: "Digital", name: "Screen Resolution", description: "Display resolutions, aspect ratios, pixel density", icon: "Monitor", custom: true },
  { id: "ip-subnet-calculator", group: "Digital", name: "IP Address & Subnet Calculator", description: "IPv4 and IPv6 subnet calculations, network addresses, host ranges, subnet masks", icon: "Network", custom: true },
  { id: "bandwidth-calculator", group: "Digital", name: "Bandwidth Calculator", description: "Download/upload time calculations, website bandwidth requirements", icon: "Wifi", custom: true },
];