import { IDSpec, BackgroundColor } from './types';

// Assuming 300 DPI for pixels
// 1 inch = 25.4 mm
// pixels = (mm / 25.4) * 300
export const ID_SPECS: IDSpec[] = [
  {
    id: '1inch',
    name: '1 Inch (一寸)',
    widthMm: 25,
    heightMm: 35,
    widthPx: 295,
    heightPx: 413,
    ratio: 295 / 413
  },
  {
    id: 'small_1inch',
    name: 'Small 1 Inch (小一寸)',
    widthMm: 22,
    heightMm: 32,
    widthPx: 260,
    heightPx: 380,
    ratio: 260 / 380
  },
  {
    id: 'big_1inch',
    name: 'Big 1 Inch (大一寸)',
    widthMm: 33,
    heightMm: 48,
    widthPx: 390,
    heightPx: 567,
    ratio: 390 / 567
  },
  {
    id: '2inch',
    name: '2 Inch (二寸)',
    widthMm: 35,
    heightMm: 49, // Standard 2 inch is often 35x49 or 35x53, but generic is often cited as 35x45 or 35x49. Let's keep existing or adjust if needed.
                 // User requested Big 2 inch is 35x53. Standard 2 inch here was 35x45 in previous file. I'll keep 35x45 for "2 Inch (Passport/Visa)" but rename to standard.
    widthPx: 413,
    heightPx: 531,
    ratio: 413 / 531
  },
  {
    id: 'small_2inch',
    name: 'Small 2 Inch (小二寸)',
    widthMm: 33,
    heightMm: 48,
    widthPx: 390,
    heightPx: 567,
    ratio: 390 / 567
  },
  {
    id: 'big_2inch',
    name: 'Big 2 Inch (大二寸)',
    widthMm: 35,
    heightMm: 53,
    widthPx: 413,
    heightPx: 626,
    ratio: 413 / 626
  },
  {
    id: 'us_passport',
    name: 'US Passport (2x2")',
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
    ratio: 1
  },
  {
    id: 'cn_visa',
    name: 'Chinese Visa',
    widthMm: 33,
    heightMm: 48,
    widthPx: 390,
    heightPx: 567,
    ratio: 390 / 567
  }
];

export const PRESET_BACKGROUNDS = [
  { name: 'White', value: BackgroundColor.White, class: 'bg-white border-slate-200' },
  { name: 'Blue', value: BackgroundColor.Blue, class: 'bg-[#438edb]' },
  { name: 'Red', value: BackgroundColor.Red, class: 'bg-[#db4343]' },
  { 
    name: 'Cadre', 
    value: 'gradient_cadre', 
    class: 'bg-gradient-to-b from-[#3492C4] to-white border-slate-200',
    prompt: 'Change background to a vertical gradient from blue #3492C4 at the top to white #FFFFFF at the bottom. Ensure the person looks professional with even lighting.'
  },
];

export const SUGGESTED_PROMPTS = [
  "Remove background and replace with white",
  "Professional lighting correction",
  "Make me look younger",
  "Fix hair messy strands",
  "Convert to black and white professional photo",
  "Add a subtle retro filter"
];