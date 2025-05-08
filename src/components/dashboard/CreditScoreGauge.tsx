import React from 'react';

interface CreditScoreGaugeProps {
  score: number;
}

export const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({ score }) => {
  // Calculate the angle for the needle based on the score (0-100)
  const calculateNeedleAngle = (score: number) => {
    // Map score from 0-100 to -90 to 90 degrees (180 degree range)
    return (score / 100) * 180 - 90;
  };
  
  // Determine the color based on the score
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // green-500
    if (score >= 60) return '#3b82f6'; // blue-500
    if (score >= 40) return '#f59e0b'; // amber-500
    if (score >= 20) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };
  
  // Get text to display with the score
  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 20) return 'Poor';
    return 'Very Poor';
  };
  
  const needleAngle = calculateNeedleAngle(score);
  const scoreColor = getScoreColor(score);
  const scoreDescription = getScoreDescription(score);
  
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Gauge background */}
      <div className="absolute inset-0 rounded-full bg-gray-200" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0)' }}></div>
      
      {/* Gauge segments */}
      <div className="absolute inset-0 rounded-full" style={{ 
        background: 'conic-gradient(from 180deg, #ef4444 0deg, #f97316 36deg, #f59e0b 72deg, #3b82f6 108deg, #22c55e 144deg, #22c55e 180deg)',
        clipPath: 'polygon(50% 50%, 0 0, 100% 0)' 
      }}></div>
      
      {/* Gauge center point */}
      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
      
      {/* Needle */}
      <div 
        className="absolute top-1/2 left-1/2 w-1 h-20 bg-gray-800 rounded-full origin-bottom transform -translate-x-1/2 z-0"
        style={{ transform: `translateX(-50%) rotate(${needleAngle}deg)` }}
      ></div>
      
      {/* Score display */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-3xl font-bold" style={{ color: scoreColor }}>{score}</div>
        <div className="text-sm text-gray-600">{scoreDescription}</div>
      </div>
      
      {/* Scale markings */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* 0 mark */}
        <div className="absolute top-0 left-0 text-xs text-gray-500">0</div>
        
        {/* 25 mark */}
        <div className="absolute top-[7%] left-[17%] text-xs text-gray-500">25</div>
        
        {/* 50 mark */}
        <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 text-xs text-gray-500">50</div>
        
        {/* 75 mark */}
        <div className="absolute top-[7%] right-[17%] text-xs text-gray-500">75</div>
        
        {/* 100 mark */}
        <div className="absolute top-0 right-0 text-xs text-gray-500">100</div>
      </div>
    </div>
  );
}; 