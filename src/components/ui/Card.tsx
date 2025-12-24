
import { ReactNode, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({
  children,
  hover = false,
  padding = 'md',
  className,
  ...props
}: CardProps) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-gray-800',
        'border-gray-200 dark:border-gray-700',
        'shadow-sm transition-all duration-200',
        hover && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx(
        'mb-4 pb-4 border-b border-gray-200 dark:border-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3
      className={clsx(
        'text-lg font-semibold text-gray-900 dark:text-white',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardContent = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={clsx('space-y-4', className)} {...props}>
      {children}
    </div>
  );
};
