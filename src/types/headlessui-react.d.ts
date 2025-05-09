declare module '@headlessui/react' {
  import { ComponentProps, ElementType, ReactNode } from 'react';

  export interface DisclosureProps {
    as?: ElementType;
    className?: string;
    defaultOpen?: boolean;
    open?: boolean;
    onChange?: (open: boolean) => void;
    children: (props: { open: boolean }) => ReactNode;
  }

  export const Disclosure: React.FC<DisclosureProps> & {
    Button: React.FC<{ as?: ElementType; className?: string; children: ReactNode }>;
    Panel: React.FC<{ as?: ElementType; className?: string; children: ReactNode }>;
  };

  export interface MenuProps {
    as?: ElementType;
    className?: string;
    children: ReactNode;
  }

  export const Menu: React.FC<MenuProps> & {
    Button: React.FC<{ as?: ElementType; className?: string; children: ReactNode }>;
    Items: React.FC<{ as?: ElementType; className?: string; children: ReactNode }>;
    Item: React.FC<{
      as?: ElementType;
      className?: string;
      disabled?: boolean;
      children: (props: { active: boolean }) => ReactNode;
    }>;
  };

  export interface TransitionProps {
    as?: ElementType;
    className?: string;
    show?: boolean;
    appear?: boolean;
    enter?: string;
    enterFrom?: string;
    enterTo?: string;
    leave?: string;
    leaveFrom?: string;
    leaveTo?: string;
    beforeEnter?: () => void;
    afterEnter?: () => void;
    beforeLeave?: () => void;
    afterLeave?: () => void;
    children: ReactNode;
  }

  export const Transition: React.FC<TransitionProps> & {
    Child: React.FC<Omit<TransitionProps, 'show'>>;
  };
}
