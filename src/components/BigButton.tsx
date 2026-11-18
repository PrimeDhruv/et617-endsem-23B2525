import React from 'react';

interface BigButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger';
  size?: 'normal' | 'large';
  icon?: React.ReactNode;
}

export const BigButton: React.FC<BigButtonProps> = ({
  children,
  variant = 'primary',
  size = 'normal',
  icon,
  className = '',
  disabled = false,
  ...rest
}) => {
  const baseStyles =
    'min-h-[56px] px-6 py-3.5 rounded-2xl font-extrabold text-xl transition-all duration-150 inline-flex items-center justify-center gap-3 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm';

  const variants = {
    primary:
      'bg-plant text-white hover:bg-plant-dark active:bg-plant-dark shadow-plant/20 hover:shadow-md focus-visible:ring-4 focus-visible:ring-plant-light',
    secondary:
      'bg-water text-white hover:bg-water-dark active:bg-water-dark shadow-water/20 hover:shadow-md focus-visible:ring-4 focus-visible:ring-water-light',
    accent:
      'bg-sun text-charcoal hover:bg-sun-dark active:bg-sun-dark shadow-sun/20 hover:shadow-md focus-visible:ring-4 focus-visible:ring-sun-light',
    outline:
      'bg-white text-gray-800 border-2 border-gray-300 hover:border-gray-500 hover:bg-gray-50 focus-visible:ring-4 focus-visible:ring-gray-300',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-4 focus-visible:ring-red-400',
  };

  const sizes = {
    normal: 'text-lg sm:text-xl py-3.5 px-6',
    large: 'text-xl sm:text-2xl py-4 sm:py-5 px-8',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {icon && <span className="text-2xl flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
