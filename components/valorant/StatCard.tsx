'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import NumberTicker from "@/components/ui/number-ticker";
import Image from "next/image";

interface StatCardProps {
  label: string;
  value: number | string;
  percentile?: number;
  decimalPlaces?: number;
  showGradientText?: boolean;
  size?: 'normal' | 'large';
  iconUrl?: string;
}

const StatCard = ({
  label,
  value,
  percentile,
  decimalPlaces = 1,
  showGradientText = false,
  size = 'normal',
  iconUrl
}: StatCardProps) => {
  const ValueDisplay = () => {
    if (showGradientText) {
      return (
        <GradientText
          colors={["#ff4655", "#ff8f98", "#ff4655"]}
          animationSpeed={3}
          className="text-xl font-bold"
          interactive={false}
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

  const PercentileDisplay = () => {
    if (typeof percentile === 'undefined') return null;
    return (
      <div className="text-xs text-[#ff4655]/60 mt-1">
        Top <NumberTicker 
          value={percentile} 
          decimalPlaces={1}
          className="inline-block text-inherit"
        />%
      </div>
    );
  };

  return (
    <Card className="relative bg-white/5 backdrop-blur-sm border-[#ff4655]/10 overflow-hidden group">
      {/* Gradient layer that bleeds from edges */}
      <div className="absolute inset-0">
        {/* Radial gradient from corners */}
        <div className="absolute inset-0 opacity-[0.04] transition-opacity duration-300 ease-in-out group-hover:opacity-[0.1]"
             style={{
               background: `
                 radial-gradient(circle at 0 0, #ff4655 0%, transparent 85%),
                 radial-gradient(circle at 100% 0, #ff4655 0%, transparent 85%),
                 radial-gradient(circle at 0 100%, #ff4655 0%, transparent 85%),
                 radial-gradient(circle at 100% 100%, #ff4655 0%, transparent 85%)
               `
             }}
        />
        
        {/* Linear gradients from edges */}
        <div className="absolute inset-0 opacity-[0.03] transition-opacity duration-300 ease-in-out group-hover:opacity-[0.08]"
             style={{
               background: `
                 linear-gradient(90deg, #ff4655 0%, transparent 70%),
                 linear-gradient(-90deg, #ff4655 0%, transparent 70%),
                 linear-gradient(0deg, #ff4655 0%, transparent 70%),
                 linear-gradient(180deg, #ff4655 0%, transparent 70%)
               `
             }}
        />
      </div>
      
      <CardContent className="p-4 relative">
        {size === 'large' ? (
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-[#ff4655]/10 to-transparent relative">
              {iconUrl && (
                <Image
                  src={iconUrl}
                  alt={`${value} rank icon`}
                  fill
                  className="object-contain p-1"
                />
              )}
            </div>
            <div>
              <h3 className="text-sm text-[#ff4655] font-medium mb-1">{label}</h3>
              <ValueDisplay />
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-sm text-[#ff4655] font-medium mb-1">{label}</h3>
            <ValueDisplay />
            <PercentileDisplay />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;