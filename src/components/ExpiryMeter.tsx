import React from 'react';

interface ExpiryMeterProps {
  daysLeft: number;
  totalShelfLifeDays: number;
  className?: string;
}

export const ExpiryMeter: React.FC<ExpiryMeterProps> = ({
  daysLeft,
  totalShelfLifeDays,
  className = '',
}) => {
  const segments = 5;
  const ratio = Math.max(0, Math.min(1, daysLeft / Math.max(1, totalShelfLifeDays)));
  const filledSegments = Math.round(ratio * segments);

  let labelColor = 'text-mint';
  let badgeText = `${daysLeft} days fresh`;
  if (daysLeft <= 2) {
    labelColor = 'text-tomato font-bold';
    badgeText = `Expires in ${daysLeft}d!`;
  } else if (daysLeft <= 5) {
    labelColor = 'text-yolk font-bold';
    badgeText = `${daysLeft}d left`;
  }

  return (
    <div className={`flex flex-col gap-1 select-none ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-crust font-medium text-[11px]">Shelf Freshness</span>
        <span className={`text-[11px] font-bold ${labelColor}`}>{badgeText}</span>
      </div>

      {/* Segmented Pill Track */}
      <div className="flex items-center gap-1 p-1 bg-surface-container-high border-2 border-ink rounded-full h-5">
        {Array.from({ length: segments }).map((_, idx) => {
          const isFilled = idx < filledSegments;
          let colorClass = 'bg-mint';
          if (idx <= 1) colorClass = 'bg-tomato';
          else if (idx <= 2) colorClass = 'bg-yolk';

          return (
            <div
              key={idx}
              className={`flex-1 h-full rounded-full transition-all duration-300 ${
                isFilled ? colorClass : 'bg-canvas opacity-40'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
