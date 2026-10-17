import React, { useState, useRef, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';

interface PortionStepperProps {
  value: number;
  onChange: (val: number) => void;
  unit: string;
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export const PortionStepper: React.FC<PortionStepperProps> = ({
  value,
  onChange,
  unit,
  step = 1,
  min = 0,
  max,
  disabled = false,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speedRef = useRef(150);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const updateValue = (delta: number) => {
    const next = Math.max(min, Number((value + delta).toFixed(2)));
    if (max !== undefined && next > max) return;
    onChange(next);
  };

  const startHold = (delta: number) => {
    if (disabled) return;
    updateValue(delta);
    speedRef.current = 200;

    const tick = () => {
      updateValue(delta);
      if (speedRef.current > 40) {
        speedRef.current -= 20;
      }
      timerRef.current = setTimeout(tick, speedRef.current);
    };

    timerRef.current = setTimeout(tick, 300);
  };

  const stopHold = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, parsed);
      onChange(max !== undefined ? Math.min(max, clamped) : clamped);
    } else {
      setInputValue(value.toString());
    }
  };

  return (
    <div
      className={`inline-flex items-center h-11 bg-canvas border-2.5 border-ink rounded-full overflow-hidden shadow-chibi-sm select-none ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
    >
      {/* Minus Button */}
      <button
        type="button"
        onMouseDown={() => startHold(-step)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(-step)}
        onTouchEnd={stopHold}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className="w-10 h-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container active:bg-yolk transition-colors border-r-2 border-ink text-ink font-bold disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Minus className="w-4 h-4 stroke-[3]" />
      </button>

      {/* Numeric Capsule Content */}
      <div className="px-3 min-w-[80px] h-full flex items-center justify-center">
        {isEditing ? (
          <input
            type="number"
            value={inputValue}
            autoFocus
            step={step}
            min={min}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleInputBlur()}
            className="w-16 text-center text-sm font-bold bg-transparent outline-none tabular-nums text-ink"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-sm font-bold text-ink hover:text-crust transition-colors"
            title="Click to type exact number"
          >
            <span className="tabular-nums">{value}</span>
            <span className="text-xs font-semibold text-crust lowercase">{unit}</span>
          </button>
        )}
      </div>

      {/* Plus Button */}
      <button
        type="button"
        onMouseDown={() => startHold(step)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(step)}
        onTouchEnd={stopHold}
        disabled={disabled || (max !== undefined && value >= max)}
        aria-label="Increase quantity"
        className="w-10 h-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container active:bg-yolk transition-colors border-l-2 border-ink text-ink font-bold disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
      </button>
    </div>
  );
};
