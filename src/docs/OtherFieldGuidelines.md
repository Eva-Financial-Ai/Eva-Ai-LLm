# "Other" Option Field Guidelines

## Overview

When presenting users with predefined options in a select dropdown, we should always include an "Other" option to accommodate responses that don't fit into our predefined categories. When a user selects "Other", we must provide a text input field for them to specify what they mean.

## Implementation Options

We have several options for implementing the "Other" field pattern across our platform:

### 1. Using the FormFieldWithOther Component

The most straightforward approach is to use our `FormFieldWithOther` component:

```tsx
import FormFieldWithOther from '../components/common/FormFieldWithOther';

// Inside your component:
<FormFieldWithOther
  label="Purpose of Financing"
  name="purpose"
  type="select"
  value={formValues.purpose}
  onChange={handleChange}
  otherValue={formValues.purpose_other}
  onOtherChange={(name, value) => 
    setFormValues({...formValues, purpose_other: value})
  }
  options={[
    { value: 'working_capital', label: 'Working Capital' },
    { value: 'equipment_purchase', label: 'Equipment Purchase' },
    // Additional options...
  ]}
  required={true}
  error={errors.purpose}
/>
```

### 2. Using the useFormWithOther Hook

For more complex forms, use our custom hook:

```tsx
import useFormWithOther from '../hooks/useFormWithOther';
import { SelectOption } from '../components/common/SelectField';

// Define your options
const purposeOptions: SelectOption[] = [
  { value: 'working_capital', label: 'Working Capital' },
  { value: 'equipment_purchase', label: 'Equipment Purchase' },
  // Additional options...
];

// Inside your component:
const {
  formValues,
  errors,
  handleChange,
  handleOtherChange,
  validateOtherFields,
  getTransformedValues
} = useFormWithOther({
  initialValues: {
    purpose: '',
    purpose_other: '',
    // Other form fields...
  }
});

// In your form:
<FormFieldWithOther
  label="Purpose of Financing"
  name="purpose"
  type="select"
  value={formValues.purpose}
  onChange={handleChange}
  otherValue={formValues.purpose_other}
  onOtherChange={handleOtherChange}
  options={purposeOptions}
  required={true}
  error={errors.purpose}
/>

// When submitting the form:
const handleSubmit = (e) => {
  e.preventDefault();
  
  // Validate that "Other" fields have values if selected
  if (!validateOtherFields()) {
    return;
  }
  
  // Get form values with transformed "Other" fields
  const submissionData = getTransformedValues();
  // Submit the data...
};
```

### 3. Manual Implementation

For simpler cases or when you need more control:

```tsx
const [purpose, setPurpose] = useState('');
const [otherPurpose, setOtherPurpose] = useState('');
const [errors, setErrors] = useState({});

const handlePurposeChange = (e) => {
  setPurpose(e.target.value);
  
  // Clear the "other" value if switching to a non-other option
  if (e.target.value !== 'other') {
    setOtherPurpose('');
  }
};

// In your form:
<div>
  <label>Purpose of Financing</label>
  <select value={purpose} onChange={handlePurposeChange}>
    <option value="">Select Purpose</option>
    <option value="working_capital">Working Capital</option>
    <option value="equipment_purchase">Equipment Purchase</option>
    <option value="other">Other</option>
  </select>
  
  {purpose === 'other' && (
    <input
      type="text"
      value={otherPurpose}
      onChange={(e) => setOtherPurpose(e.target.value)}
      placeholder="Please specify"
    />
  )}
</div>

// Validation:
const validateForm = () => {
  const newErrors = {};
  
  if (purpose === 'other' && !otherPurpose.trim()) {
    newErrors.purpose = 'Please specify the other purpose';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Best Practices

1. **Always Include an "Other" Option**: Any predefined list of options should include "Other" as the last option.

2. **Always Show a Text Field When "Other" is Selected**: When a user selects "Other", immediately display a text field for them to specify what they mean.

3. **Validate "Other" Text**: Ensure that the "Other" text field is not empty when submitted.

4. **Preserve User Input**: When the form is submitted or saved, preserve both the fact that the user selected "Other" and their specified text.

5. **Display the Specified Text**: When displaying the user's selection in other parts of the app, show their specified text for the "Other" option, not just "Other".

6. **Use Consistent Field Naming**: For storage, use a naming convention like `fieldName` for the main field and `fieldName_other` for the "Other" specification.

## Accessibility Considerations

- Ensure the "Other" text field is part of the tab order
- Use proper labeling and form validation for all fields
- Include appropriate ARIA attributes when needed
- Make sure error messages are clear and helpful 