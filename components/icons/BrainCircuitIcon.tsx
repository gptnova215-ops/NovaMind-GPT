
import React from 'react';

// FIX: Update component to accept a `title` prop for accessibility.
// This resolves a TypeScript error where the `title` prop was passed without being defined in the component's props.
export const BrainCircuitIcon = ({ title, ...props }: React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {title && <title>{title}</title>}
    <path d="M12 2a10 10 0 0 0-3.952 19.493 10 10 0 0 0 7.904 0A10 10 0 0 0 12 2Z" />
    <path d="M12 12h.01" />
    <path d="M12 18h.01" />
    <path d="M12 6h.01" />
    <path d="M15.5 8.5h.01" />
    <path d="M15.5 15.5h.01" />
    <path d="M8.5 8.5h.01" />
    <path d="M8.5 15.5h.01" />
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="M15.5 8.5l3-3" />
    <path d="m5.5 5.5 3 3" />
    <path d="M15.5 15.5l3 3" />
    <path d="m5.5 18.5 3-3" />
  </svg>
);
