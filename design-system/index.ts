/**
 * EVA Design System
 * A comprehensive design system for the EVA Platform Frontend
 */

// Export design tokens
export { default as tokens } from './tokens';

// Export components
export { default as Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { default as Card } from './components/Card';
export type { CardProps } from './components/Card';

export { default as Input } from './components/Input';
export type { InputProps } from './components/Input';

export { default as Badge } from './components/Badge';
export type { BadgeProps } from './components/Badge';

// Export Table component
export { Table } from './components/Table';
export type { TableProps, TableColumn } from './components/Table';

// Design system version
export const version = '1.0.0';

// Design system theme context (to be implemented)
export const themes = {
  light: 'light',
  dark: 'dark',
};

/**
 * Usage example:
 * 
 * import { Button, Card, Input, Badge, Table, tokens } from 'design-system';
 * 
 * function MyComponent() {
 *   return (
 *     <Card 
 *       title="My Card"
 *       variant="default"
 *       padding="md"
 *     >
 *       <Input
 *         label="Name"
 *         placeholder="Enter your name"
 *         variant="outlined"
 *       />
 *       <div className="status">
 *         <Badge variant="success">Active</Badge>
 *       </div>
 *       <Button variant="primary">
 *         Submit
 *       </Button>
 *     </Card>
 *   );
 * }
 */ 