import { cn } from '../../utils/cn';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  disabled,
  ...props 
}) => {
  const baseStyles = 'btn font-heading font-semibold';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline btn-primary',
    danger: 'btn-error',
    success: 'btn-success',
  };

  const sizes = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;