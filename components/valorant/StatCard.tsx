'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import NumberTicker from "@/components/ui/number-ticker";

interface StatCardProps {
  label: string;
  value: number | string;
  percentile?: number;
  decimalPlaces?: number;
  showGradientText?: boolean;
  size?: 'normal' | 'large';
}

const StatCard = ({
  label,
  value,
  percentile,
  decimalPlaces = 1,
  showGradientText = false,
  size = 'normal'
}: StatCardProps) => {
  const ValueDisplay = () => {
    if (showGradientText) {
      return (
        <GradientText
          colors={["#ff4655", "#ff8f98", "#ff4655"]}
          animationSpeed={3}
          className="text-xl font-bold"
        >
          {value}
        </GradientText>
      );
    }
    return (
      <div className={`${size === 'large' ? 'text-2xl' : 'text-xl'} font-bold text-white`}>
        {typeof value === 'number' ? (
          <NumberTicker 
            value={value} 
            decimalPlaces={decimalPlaces}
          />
        ) : value}
      </div>
    );
  };

  return (
    <Card className="relative bg-white/5 backdrop-blur-sm border-[#ff4655]/10 overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff4655]/10 via-[#ff4655]/5 to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />
      <CardContent className="p-4 relative">
        {size === 'large' ? (
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-[#ff4655]/20 to-transparent" />
            <div>
              <h3 className="text-sm text-[#ff4655] font-medium mb-1">{label}</h3>
              <ValueDisplay />
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-sm text-[#ff4655] font-medium mb-1">{label}</h3>
            <ValueDisplay />
            {percentile && <p className="text-xs text-[#ff4655]/60">Top {percentile}%</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;