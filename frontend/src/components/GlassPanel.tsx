import { motion } from 'framer-motion';
import { fadeUp } from '../animations';
import { cn } from '../lib/utils';

export function GlassPanel({
  children,
  className,
  animate = true,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  hover?: boolean;
}) {
  const Comp = animate ? motion.div : 'div';
  const props = animate
    ? {
        variants: fadeUp,
        initial: 'hidden' as const,
        whileInView: 'visible' as const,
        viewport: { once: true, margin: '-60px' },
      }
    : {};

  return (
    <Comp
      {...props}
      className={cn(
        'relative overflow-hidden glass specular',
        hover && 'transition-all duration-500 hover:border-[rgba(255,255,255,0.22)] hover:shadow-[0_24px_70px_rgba(0,0,0,0.6)]',
        className
      )}
    >
      {children}
    </Comp>
  );
}

export function StatCard({
  icon,
  value,
  label,
  trend,
  accent = 'orange',
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: string;
  accent?: 'orange' | 'green' | 'blue' | 'purple';
}) {
  const colors = {
    orange: 'bg-[rgba(255,107,26,0.08)] border-[rgba(255,107,26,0.15)] text-[#FF6B1A] stroke-[#FF6B1A]',
    green: 'bg-[rgba(76,175,80,0.08)] border-[rgba(76,175,80,0.15)] text-[#4CAF50] stroke-[#4CAF50]',
    blue: 'bg-[rgba(66,165,245,0.08)] border-[rgba(66,165,245,0.15)] text-[#42A5F5] stroke-[#42A5F5]',
    purple: 'bg-[rgba(171,71,188,0.08)] border-[rgba(171,71,188,0.15)] text-[#AB47BC] stroke-[#AB47BC]',
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="glass specular p-6 transition-all duration-400"
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4 border', colors[accent])}>
        {icon}
      </div>
      <div className="font-display font-bold text-2xl tracking-tight">{value}</div>
      <div className="text-[0.78rem] text-[#8B8B9A] mt-1">{label}</div>
      {trend && (
        <div className={cn('text-[0.72rem] mt-2 font-mono', trend.startsWith('↑') ? 'text-[#4CAF50]' : 'text-[#EF5350]')}>
          {trend}
        </div>
      )}
    </motion.div>
  );
}
