# EVA Platform Design System

This document defines the core design system principles to ensure consistency across the EVA Platform UI.

## Spacing

We use an 8-pixel scale for all spacing to maintain visual harmony:

| Token      | Value | Usage                                            |
| ---------- | ----- | ------------------------------------------------ |
| `space-0`  | 0px   | No spacing                                       |
| `space-1`  | 4px   | Minimal spacing between tightly related elements |
| `space-2`  | 8px   | Default inner spacing (padding) for components   |
| `space-3`  | 12px  | Spacing between related elements                 |
| `space-4`  | 16px  | Standard spacing between components              |
| `space-5`  | 20px  | Padding for containers                           |
| `space-6`  | 24px  | Spacing between component groups                 |
| `space-8`  | 32px  | Section spacing                                  |
| `space-10` | 40px  | Large section spacing                            |
| `space-12` | 48px  | Page section spacing                             |
| `space-16` | 64px  | Page spacing                                     |

## Typography

### Font Family

- Primary: Helvetica, Arial, sans-serif

### Font Sizes

| Token       | Size | Line Height | Usage                      |
| ----------- | ---- | ----------- | -------------------------- |
| `text-xs`   | 12px | 16px        | Helper text, captions      |
| `text-sm`   | 14px | 20px        | Secondary text, input text |
| `text-base` | 16px | 24px        | Body text                  |
| `text-lg`   | 18px | 28px        | Large body text            |
| `text-xl`   | 20px | 28px        | Subtitle, small headings   |
| `text-2xl`  | 24px | 32px        | Component headings         |
| `text-3xl`  | 30px | 36px        | Section headings           |
| `text-4xl`  | 36px | 40px        | Page headings              |

### Font Weights

| Token           | Weight | Usage                        |
| --------------- | ------ | ---------------------------- |
| `font-normal`   | 400    | Body text                    |
| `font-medium`   | 500    | Emphasis, labels, navigation |
| `font-semibold` | 600    | Headings, buttons            |
| `font-bold`     | 700    | Strong emphasis              |

## Colors

### Primary Colors

- Primary: Red shades (primary-50 through primary-900)
- Secondary: Blue shades (secondary-100 through secondary-900)

### Status Colors

- Success: Green shades (green-50 through green-900)
- Warning: Yellow shades (amber-50 through amber-900)
- Error: Red shades (risk-red, risk-red-light, risk-red-dark)
- Info: Blue shades (blue-50 through blue-900)

### Neutral Colors

- Gray scale: (gray-50 through gray-900)
- Silver: (silver-100 through silver-600)

## Components

### Buttons

#### Variants

- **Primary**: Main call-to-action, primary-600 background
- **Secondary**: Alternative options, gray-200 background
- **Danger**: Destructive actions, risk-red background
- **Success**: Confirmations, green-600 background
- **Outline**: Subtle actions, transparent background with gray border

#### Sizes

- **Small**: px-2.5 py-1.5 text-xs
- **Medium**: px-4 py-2 text-sm (default)
- **Large**: px-6 py-3 text-base

### Cards

#### Variants

- **Default**: White background, subtle shadow, 8px border radius
- **Highlight**: White background, primary border, subtle shadow
- **Interactive**: White background, hover state with elevated shadow

### Form Elements

All form elements should have:

- Consistent 8px border radius
- Clear focus states with primary-500 ring
- Proper error states with risk-red elements
- Consistent padding based on input size
- Proper label alignment and spacing

### Modal Dialogs

- Consistent max-widths (sm, md, lg, xl)
- Standard padding of 24px (space-6)
- Proper heading hierarchy
- Consistent button layouts in footer

## Responsive Breakpoints

| Breakpoint | Value  | Description                          |
| ---------- | ------ | ------------------------------------ |
| `sm`       | 640px  | Small devices (mobile landscape)     |
| `md`       | 768px  | Medium devices (tablets)             |
| `lg`       | 1024px | Large devices (desktops)             |
| `xl`       | 1280px | Extra large devices (large desktops) |
| `2xl`      | 1536px | Extra extra large devices            |

## Z-Index Scale

| Token  | Value | Usage                                         |
| ------ | ----- | --------------------------------------------- |
| `z-0`  | 0     | Default, non-overlapping elements             |
| `z-10` | 10    | Slightly elevated elements (cards, dropdowns) |
| `z-20` | 20    | Floating elements (tooltips, popovers)        |
| `z-30` | 30    | Sticky elements (headers, footers)            |
| `z-40` | 40    | Fixed elements                                |
| `z-50` | 50    | Modals, dialogs                               |
| `z-60` | 60    | Notifications, toasts                         |
| `z-70` | 70    | Critical notifications                        |

## Transitions and Animations

### Durations

- **Fast**: 150ms (micro-interactions)
- **Default**: 200ms (most UI transitions)
- **Slow**: 300ms (larger UI transitions)

### Easing Functions

- **Default**: ease-in-out
- **Entrance**: ease-out
- **Exit**: ease-in
- **Emphasis**: cubic-bezier(0.4, 0, 0.2, 1)
