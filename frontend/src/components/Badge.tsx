import { cn } from '../lib/utils';

type BadgeVariant = 'green' | 'red' | 'yellow' | 'gray' | 'orange' | 'blue' | 'purple';

const variants: Record<BadgeVariant, string> = {
  green: 'bg-[rgba(76,175,80,0.12)] text-[#4CAF50] border-[rgba(76,175,80,0.2)]',
  red: 'bg-[rgba(239,83,80,0.12)] text-[#EF5350] border-[rgba(239,83,80,0.2)]',
  yellow: 'bg-[rgba(249,168,37,0.12)] text-[#F9A825] border-[rgba(249,168,37,0.2)]',
  gray: 'bg-[rgba(255,255,255,0.05)] text-[#8B8B9A] border-[rgba(255,255,255,0.10)]',
  orange: 'bg-[rgba(255,107,26,0.12)] text-[#FF8533] border-[rgba(255,107,26,0.2)]',
  blue: 'bg-[rgba(66,165,245,0.12)] text-[#42A5F5] border-[rgba(66,165,245,0.2)]',
  purple: 'bg-[rgba(171,71,188,0.12)] text-[#AB47BC] border-[rgba(171,71,188,0.2)]',
};

export function Badge({
  children,
  variant = 'gray',
  dot = false,
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full',
        'text-xs font-semibold font-mono border',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current"
          style={{ animation: 'pulse 2s infinite' }}
        />
      )}
      {children}
    </span>
  );
}
