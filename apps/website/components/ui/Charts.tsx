'use client';
import { motion } from 'framer-motion';

type BarDatum = { label: string; value: number; color?: string };
type DonutDatum = { label: string; value: number; color?: string };

export function BarChart({ data, height = 140 }: { data: BarDatum[]; height?: number }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barWidth = 28;
  const gap = 16;
  const width = data.length * (barWidth + gap) + gap;

  return (
    <svg width={width} height={height} role='img' aria-label='bar chart'>
      {data.map((d, i) => {
        const barHeight = Math.round((d.value / max) * (height - 32));
        const x = gap + i * (barWidth + gap);
        const y = height - barHeight - 20;
        return (
          <g key={d.label}>
            <motion.rect
              initial={{ height: 0, y: height - 20 }}
              animate={{ height: barHeight, y }}
              transition={{ type: 'spring', stiffness: 140, damping: 18, delay: i * 0.05 }}
              x={x}
              width={barWidth}
              rx={6}
              fill={d.color || '#8b5cf6'}
            />
            <text x={x + barWidth / 2} y={height - 6} textAnchor='middle' fontSize='10' fill='#6b7280'>
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChart({ data, size = 160 }: { data: DonutDatum[]; size?: number }) {
  const total = Math.max(1, data.reduce((acc, d) => acc + d.value, 0));
  const radius = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;
  let cumulative = 0;
  return (
    <svg width={size} height={size} role='img' aria-label='donut chart'>
      {data.map((d, i) => {
        const portion = d.value / total;
        const startAngle = cumulative * 2 * Math.PI;
        cumulative += portion;
        const endAngle = cumulative * 2 * Math.PI;
        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
        const x1 = cx + radius * Math.cos(startAngle);
        const y1 = cy + radius * Math.sin(startAngle);
        const x2 = cx + radius * Math.cos(endAngle);
        const y2 = cy + radius * Math.sin(endAngle);
        const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        return (
          <motion.path
            key={d.label}
            d={pathData}
            fill={d.color || ['#8b5cf6', '#ec4899', '#22c55e', '#f59e0b'][i % 4]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={radius * 0.6} fill='white' />
      <text x={cx} y={cy + 4} textAnchor='middle' fontSize='12' fill='#6b7280'>
        {total}
      </text>
    </svg>
  );
}


