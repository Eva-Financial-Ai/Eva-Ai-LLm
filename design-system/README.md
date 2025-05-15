# EVA Design System

A comprehensive design system for the EVA Platform Frontend that ensures consistent UI components, design tokens, and patterns across all features and platforms.

## Overview

This design system was extracted from the existing EVA Platform codebase and enhanced to provide:

- A unified token system for colors, typography, spacing, and more
- Reusable, composable UI components with consistent APIs
- Cross-platform compatibility with responsive design
- Light and dark theme support
- Accessibility compliance

## Design Tokens

All design elements have been tokenized to ensure consistency:

```javascript
import { tokens } from 'design-system';

// Using color tokens
const primaryColor = tokens.colors.brand.primary[500];
const riskColor = tokens.colors.semantic.risk.default;

// Using spacing tokens
const standardPadding = tokens.spacing[4]; // 1rem
```

### Available Token Categories

- `colors`: All color values including brand, semantic, and neutral palettes
- `typography`: Font families, sizes, weights, line heights, and letter spacing
- `spacing`: Standardized spacing scale for margins and padding
- `layout`: Layout-specific tokens like sidebar widths and header heights
- `animation`: Animation timings, keyframes, and easing functions
- `borders`: Border widths, radii
- `shadows`: Elevation and shadow values

## Components

### Basic Example

```jsx
import { Button, Card, Input } from 'design-system';

function MyForm() {
  return (
    <Card 
      title="Registration Form" 
      variant="default"
      padding="md"
    >
      <Input
        label="Email Address"
        type="email"
        required
        placeholder="Enter your email"
      />
      
      <Button 
        variant="primary" 
        size="md"
        type="submit"
      >
        Submit
      </Button>
    </Card>
  );
}
```

### Available Components

- **Button**: Interactive button element with various styles and sizes
- **Card**: Container component for grouping related content
- **Input**: Form input element with various styles and validations

## Theming

The design system supports both light and dark themes:

```jsx
import { Card, Button, tokens } from 'design-system';

function ThemeExample() {
  return (
    <>
      {/* Light theme (default) */}
      <Card title="Light Theme">
        <Button variant="primary">Primary Action</Button>
      </Card>
      
      {/* Dark theme */}
      <Card title="Dark Theme" darkMode>
        <Button variant="primary">Primary Action</Button>
      </Card>
    </>
  );
}
```

## Responsive Design

All components are built with responsive design in mind:

- Mobile-first approach
- Consistent breakpoints
- Fluid scaling

## Accessibility

The design system prioritizes accessibility:

- WCAG 2.1 AA compliance
- Proper semantics and ARIA attributes
- Keyboard navigation support
- Screen reader friendly

## Implementation Goals

1. **Consistency**: Ensure visual and behavioral consistency across the application
2. **Flexibility**: Allow for component customization without breaking design rules
3. **Maintainability**: Centralize design decisions to simplify updates
4. **Performance**: Optimize components for rendering performance
5. **Developer Experience**: Provide clear, well-documented APIs

## Integration Guidelines

When integrating the design system into existing components:

1. Replace direct Tailwind CSS classes with design system components
2. Use design tokens instead of hard-coded values
3. Prefer composition over modification
4. Follow naming conventions for consistency

## Future Enhancements

- More complex components (tables, modals, etc.)
- Animation system
- Form system with validation
- Theme provider context
- Visual regression testing

## Contributing

When adding new components to the design system:

1. Follow the established patterns for props and styling
2. Include proper TypeScript types and documentation
3. Create Storybook examples for all variants
4. Ensure accessibility compliance
5. Include responsive behavior 