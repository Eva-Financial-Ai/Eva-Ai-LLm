import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  width?: string;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 300,
  width = 'auto',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const childRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  let timer: ReturnType<typeof setTimeout>;

  // Position the tooltip based on the child element's position
  const updatePosition = () => {
    if (!childRef.current || !tooltipRef.current) return;

    const childRect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = childRect.top - tooltipRect.height - 8;
        left = childRect.left + childRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'bottom':
        top = childRect.bottom + 8;
        left = childRect.left + childRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'left':
        top = childRect.top + childRect.height / 2 - tooltipRect.height / 2;
        left = childRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = childRect.top + childRect.height / 2 - tooltipRect.height / 2;
        left = childRect.right + 8;
        break;
      default:
        break;
    }

    // Adjust to keep tooltip in viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }

    if (top < 10) top = 10;
    if (top + tooltipRect.height > viewportHeight - 10) {
      top = viewportHeight - tooltipRect.height - 10;
    }

    setCoords({ top, left });
  };

  const handleMouseEnter = () => {
    timer = setTimeout(() => {
      setIsVisible(true);
      // Update position after the tooltip is visible
      setTimeout(updatePosition, 0);
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timer);
    setIsVisible(false);
  };

  // Update position if window is resized
  useEffect(() => {
    if (isVisible) {
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }

    return undefined;
  }, [isVisible]);

  // Get tooltip pointer styles based on position
  const getPointerStyles = () => {
    const baseStyles = {
      content: "''",
      position: 'absolute',
      width: 0,
      height: 0,
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyles,
          bottom: '-4px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid #1f2937', // gray-800
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: '-4px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderBottom: '5px solid #1f2937', // gray-800
        };
      case 'left':
        return {
          ...baseStyles,
          right: '-4px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: '5px solid #1f2937', // gray-800
        };
      case 'right':
        return {
          ...baseStyles,
          left: '-4px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderRight: '5px solid #1f2937', // gray-800
        };
      default:
        return {};
    }
  };

  // Use a wrapper div instead of trying to clone with ref
  return (
    <>
      <div
        ref={childRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`inline-block ${className}`}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: width,
            zIndex: 9999,
            pointerEvents: 'none',
            backgroundColor: '#1f2937',
            color: 'white',
            fontSize: '0.75rem',
            padding: '0.375rem 0.625rem',
            borderRadius: '0.25rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
          onMouseEnter={handleMouseLeave} // Hide tooltip when mouse enters it
        >
          {content}
          <div style={getPointerStyles()} />
        </div>
      )}
    </>
  );
};
