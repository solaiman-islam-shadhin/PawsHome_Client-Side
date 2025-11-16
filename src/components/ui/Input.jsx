import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({ 
  className, 
  type = 'text', 
  error,
  label,
  ...props 
}, ref) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-heading font-semibold">{label}</span>
        </label>
      )}
      <input
        type={type}
        className={cn(
          'input input-bordered w-full font-body',
          error && 'input-error',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error font-body">{error}</span>
        </label>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;