# Design Guidelines - EVA Platform Frontend

## Typography Standards

### Font Sizes
- `text-xs` (0.75rem/12px): Default for most content, tables, input fields
- `text-sm` (0.875rem/14px): Headers, titles, important information
- `text-base` (1rem/16px): Main headings, emphasized content
- `text-lg` and above: Use sparingly for major section headings

### Icons
- Standard size: `w-4 h-4` (16px)
- Medium size: `w-5 h-5` (20px) - use only when necessary for improved visibility
- Large size: `w-6 h-6` (24px) - use only for navigation elements that need emphasis

### Spacing
- Small spacing: `p-1`, `px-1.5`, `py-1`, `m-1`, `mx-1.5`, `my-1`
- Medium spacing: `p-2`, `px-2.5`, `py-2`, `m-2`, `mx-2.5`, `my-2`
- Large spacing: `p-3`, `px-3`, `py-3`, `m-3`, `mx-3`, `my-3`
- Avoid spacing values above 12 unless specifically needed

## Color System

### Primary Colors
- Primary blue: `primary-500` (#3B82F6)
- Light blue variants: `primary-50` through `primary-400`
- Dark blue variants: `primary-600` through `primary-900`

### Gray Scale
- Background: `bg-gray-100`
- Borders: `border-gray-200`
- Text: `text-gray-700` (primary), `text-gray-500` (secondary)
- Hover states: `hover:bg-gray-100`

### Semantic Colors
- Risk/Error: `risk-red` (#D32F2F)
- Success: `green-500` (#10B981)
- Warning: `yellow-500` (#F59E0B)
- Info: `blue-500` (#3B82F6)

## Component Styling

### Sidebar
- Width: 14rem (224px) expanded, 3.5rem (56px) collapsed
- Nav items: `py-2 px-2.5` for padding
- Section titles: `text-xs uppercase tracking-wider text-gray-500`
- Icons: `w-4 h-4` consistently

### Navigation Elements
- Navbar height: 3.5rem (56px)
- Top navigation: `py-1 px-3` with `text-sm` heading
- Buttons: `text-xs` with `px-2 py-1` padding

### Content Areas
- Card padding: `p-4` (or `px-4 py-3` for compact cards)
- Section spacing: `mb-4` between major sections
- Form elements: `text-xs` inputs with `px-3 py-2` padding

## Layout Guidelines

### Responsive Breakpoints
- Mobile: Default (< 768px)
- Tablet: `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)
- Large Desktop: `xl:` (≥ 1280px)

### Container Width
- Full width on mobile
- Centered with max-width on larger screens

## Implementation Tips

### Typography Testing
Run the typography check script to identify inconsistencies:

```bash
npm run check-typography
```

### Design System Usage
- Always use the color variables defined in the design system
- Avoid inline hex colors or arbitrary values
- Use the standard font sizes rather than custom values
- Follow the spacing scale consistently

### Component Development
- Check existing components for styling patterns before creating new ones
- Reference this guide when implementing new UI elements
- When in doubt, prefer simplicity and consistency over custom styling

## Typography Audit Results
Current status as of last typography check:
- Font size inconsistencies: 4,818 issues
- Icon size inconsistencies: 364 issues
- Color inconsistencies: 1,822 issues
- Spacing inconsistencies: 13 issues

Priority areas for improvement:
1. Standardize font sizes across the application
2. Ensure all icons have matching width and height
3. Follow the design system color palette
4. Maintain consistent spacing 