# ESLint Migration Plan

This document outlines a step-by-step plan to fix all ESLint issues in the codebase properly, rather than simply ignoring them.

## Priority Issues

### 1. React Hooks Rules Violations

Files with issues:
- `src/components/CreditApplicationForm.tsx`
- `src/contexts/WorkflowContext.tsx`

Action Items:
- [ ] Move all hook calls to the top level of the component
- [ ] Refactor conditional logic to occur inside the hooks rather than around them
- [ ] Ensure hooks aren't called inside loops or conditions
- [ ] Verify dependency arrays for all useEffect and useCallback hooks

Example fix for conditional hooks:
```tsx
// BEFORE - Problematic code
function MyComponent() {
  if (condition) {
    useEffect(() => { /* effect */ }, []);
  }
}

// AFTER - Fixed code
function MyComponent() {
  useEffect(() => {
    if (condition) {
      /* effect */
    }
  }, [condition]);
}
```

### 2. Testing Library Best Practices

Files with issues:
- `src/components/risk/__tests__/RiskMapEvaReport.test.tsx`
- `src/tests/typography.test.tsx`

Action Items:
- [ ] Replace multiple assertions within waitFor with sequential waitFor calls
- [ ] Replace container.querySelector with proper Testing Library queries (getByRole, getByText, etc.)
- [ ] Remove direct DOM node access

Example fix for waitFor multiple assertions:
```tsx
// BEFORE - Problematic code
await waitFor(() => {
  expect(something).toBeTrue();
  expect(somethingElse).toBeFalse();
});

// AFTER - Fixed code
await waitFor(() => expect(something).toBeTrue());
await waitFor(() => expect(somethingElse).toBeFalse());
```

Example fix for container queries:
```tsx
// BEFORE - Problematic code
const element = container.querySelector('.some-class');

// AFTER - Fixed code
const element = screen.getByRole('button', { name: /button text/i });
// or
const element = screen.getByText(/text content/i);
```

### 3. Import Order Issues

Files with issues:
- `src/components/TransactionExecution.tsx`

Action Items:
- [ ] Move all imports to the top of the file
- [ ] Group imports properly (React, external libraries, internal components)
- [ ] Fix any circular dependencies that may be causing issues

## Timeline

1. Week 1: Fix React Hooks violations
2. Week 2: Fix Testing Library best practices issues
3. Week 3: Fix import order and misc. issues
4. Week 4: Verify all fixes and run full test suite

## Running in Strict Mode

To validate the fixes, periodically run:
```bash
npm run lint -- --max-warnings=0
```

When all issues are fixed, we can remove the overrides in .eslintrc.local.js and enforce all rules.
