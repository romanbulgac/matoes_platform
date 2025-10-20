import { cn } from '@/lib/utils';
import { FC, ReactNode } from 'react';

// Typography Interfaces
interface TypographyProps {
  children: ReactNode;
  className?: string;
}

interface TypographyCodeProps extends TypographyProps {
  variant?: 'inline' | 'block';
}

// Typography Components following Mateos platform patterns
export const TypographyH1: FC<TypographyProps> = ({ children, className }) => {
  return (
    <h1 className={cn(
      "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance font-display",
      className
    )}>
      {children}
    </h1>
  );
};

export const TypographyH2: FC<TypographyProps> = ({ children, className }) => {
  return (
    <h2 className={cn(
      "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-display",
      className
    )}>
      {children}
    </h2>
  );
};

export const TypographyH3: FC<TypographyProps> = ({ children, className }) => {
  return (
    <h3 className={cn(
      "scroll-m-20 text-2xl font-semibold tracking-tight font-display",
      className
    )}>
      {children}
    </h3>
  );
};

export const TypographyH4: FC<TypographyProps> = ({ children, className }) => {
  return (
    <h4 className={cn(
      "scroll-m-20 text-xl font-semibold tracking-tight font-display",
      className
    )}>
      {children}
    </h4>
  );
};

export const TypographyH5: FC<TypographyProps> = ({ children, className }) => {
  return (
    <h5 className={cn(
      "scroll-m-20 text-lg font-semibold tracking-tight font-display",
      className
    )}>
      {children}
    </h5>
  );
};

export const TypographyH6: FC<TypographyProps> = ({ children, className }) => {
  return (
    <h6 className={cn(
      "scroll-m-20 text-base font-semibold tracking-tight font-display",
      className
    )}>
      {children}
    </h6>
  );
};

export const TypographyP: FC<TypographyProps> = ({ children, className }) => {
  return (
    <p className={cn(
      "leading-7 [&:not(:first-child)]:mt-6",
      className
    )}>
      {children}
    </p>
  );
};

export const TypographyLead: FC<TypographyProps> = ({ children, className }) => {
  return (
    <p className={cn(
      "text-muted-foreground text-xl font-display",
      className
    )}>
      {children}
    </p>
  );
};

export const TypographyLarge: FC<TypographyProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "text-lg font-semibold font-display",
      className
    )}>
      {children}
    </div>
  );
};

export const TypographySmall: FC<TypographyProps> = ({ children, className }) => {
  return (
    <small className={cn(
      "text-sm leading-none font-medium",
      className
    )}>
      {children}
    </small>
  );
};

export const TypographyMuted: FC<TypographyProps> = ({ children, className }) => {
  return (
    <p className={cn(
      "text-muted-foreground text-sm",
      className
    )}>
      {children}
    </p>
  );
};

export const TypographyBlockquote: FC<TypographyProps> = ({ children, className }) => {
  return (
    <blockquote className={cn(
      "mt-6 border-l-2 pl-6 italic",
      className
    )}>
      {children}
    </blockquote>
  );
};

export const TypographyList: FC<TypographyProps> = ({ children, className }) => {
  return (
    <ul className={cn(
      "my-6 ml-6 list-disc [&>li]:mt-2",
      className
    )}>
      {children}
    </ul>
  );
};

export const TypographyOrderedList: FC<TypographyProps> = ({ children, className }) => {
  return (
    <ol className={cn(
      "my-6 ml-6 list-decimal [&>li]:mt-2",
      className
    )}>
      {children}
    </ol>
  );
};

export const TypographyInlineCode: FC<TypographyCodeProps> = ({ 
  children, 
  className,
  variant = 'inline'
}) => {
  if (variant === 'block') {
    return (
      <pre className={cn(
        "bg-muted relative rounded-lg p-4 font-mono text-sm overflow-x-auto",
        className
      )}>
        <code>{children}</code>
      </pre>
    );
  }

  return (
    <code className={cn(
      "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      className
    )}>
      {children}
    </code>
  );
};

// Table Component with proper TypeScript types
interface TableData {
  headers: string[];
  rows: string[][];
}

interface TypographyTableProps {
  data: TableData;
  className?: string;
}

export const TypographyTable: FC<TypographyTableProps> = ({ data, className }) => {
  return (
    <div className={cn(
      "my-6 w-full overflow-y-auto",
      className
    )}>
      <table className="w-full">
        <thead>
          <tr className="even:bg-muted m-0 border-t p-0">
            {data.headers.map((header, index) => (
              <th
                key={index}
                className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-muted m-0 border-t p-0">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Utility component for consistent spacing
export const TypographySection: FC<TypographyProps> = ({ children, className }) => {
  return (
    <section className={cn(
      "space-y-4",
      className
    )}>
      {children}
    </section>
  );
};