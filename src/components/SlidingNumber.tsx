import React from 'react';

interface SlidingNumberProps {
  number: number;
  padStart?: boolean;
  padDigits?: number;
  className?: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface DigitColumnProps {
  digit: number;
}

const DigitColumn: React.FC<DigitColumnProps> = ({ digit }) => {
  const clamped = Math.min(9, Math.max(0, Math.floor(digit)));
  return (
    <span
      data-testid="odometer-digit-slot"
      className="inline-block overflow-hidden h-[1em] leading-none align-baseline"
      aria-hidden="true"
    >
      <span
        data-testid="odometer-digit-reel"
        style={{
          transform: `translateY(-${clamped * 10}%)`,
        }}
        className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
      >
        {DIGITS.map((d) => (
          <span key={d} className="block h-[1em] leading-none">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
};

/**
 * Lusion-Style 3-Digit Odometer Counter (`000` -> `100`)
 * Renders each of the 3 digits inside an individual vertical slot (`inline-block overflow-hidden h-[1em] leading-none`)
 * containing a vertical strip of digits 0 through 9 (`flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]`,
 * `transform: translateY(-${Number(digit) * 10}%)`).
 */
export const SlidingNumber: React.FC<SlidingNumberProps> = ({
  number,
  padStart = true,
  padDigits = 3,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(number)));
  const formatted = padStart
    ? String(clamped).padStart(padDigits, '0')
    : String(clamped);
  const chars = formatted.split('');

  return (
    <span
      data-testid="sliding-number"
      data-primitive="@animate-ui/react/primitives/texts/sliding-number"
      data-value={formatted}
      aria-label={formatted}
      className={`inline-flex items-baseline font-sans font-semibold tabular-nums text-5xl sm:text-6xl md:text-7xl tracking-tight text-white leading-none ${className}`.trim()}
    >
      {chars.map((char, idx) => (
        <DigitColumn key={`${chars.length}-${idx}`} digit={Number(char) || 0} />
      ))}
    </span>
  );
};

