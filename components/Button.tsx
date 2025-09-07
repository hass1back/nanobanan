import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const Button: React.FC<ButtonProps> = ({ isLoading = false, children, icon, className, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-neutral-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 disabled:pointer-events-none";
  const activeClasses = "bg-indigo-600 text-white hover:bg-indigo-500";
  const disabledClasses = "disabled:opacity-50";

  const sizeClasses = "h-10 px-4 py-2";

  return (
    <button
      disabled={isLoading || props.disabled}
      className={`${baseClasses} ${activeClasses} ${disabledClasses} ${sizeClasses} ${className || ''}`}
      {...props}
    >
      {isLoading ? <Spinner /> : icon}
      {isLoading ? 'Processing...' : children}
    </button>
  );
};

export default Button;
