import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faSearch } from '@fortawesome/free-solid-svg-icons';

const meta = {
  title: 'Components/Common/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    labelPosition: {
      control: 'radio',
      options: ['top', 'left'],
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search'],
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    leadingIcon: {
      control: false,
    },
    trailingIcon: {
      control: false,
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Password',
    helperText: 'Password must be at least 8 characters',
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const WithError: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    error: 'This username is already taken',
    value: 'existing_user',
  },
};

export const Required: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
  },
};

export const WithLeadingIcon: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    leadingIcon: <FontAwesomeIcon icon={faUser} className="text-gray-500" />,
  },
};

export const WithTrailingIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    trailingIcon: <FontAwesomeIcon icon={faSearch} className="text-gray-500" />,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    leadingIcon: <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />,
    trailingIcon: <FontAwesomeIcon icon={faLock} className="text-gray-500" />,
  },
};

export const Small: Story = {
  args: {
    label: 'Small Input',
    placeholder: 'Small size',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium Input',
    placeholder: 'Medium size',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    label: 'Large Input',
    placeholder: 'Large size',
    size: 'large',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
  },
};

export const LeftLabel: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    labelPosition: 'left',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    leadingIcon: <FontAwesomeIcon icon={faLock} className="text-gray-500" />,
  },
};
