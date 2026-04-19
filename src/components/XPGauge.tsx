import React from 'react';

/**
 * @title XPGauge
 * @author Viqtorhvayx
 * @dev Visual representation of the user's Borrowing XP (0-100).
 */

interface XPGaugeProps {
    xp: number;
}

export const XPGauge: React.FC<XPGaugeProps> = ({ xp }) => {
    // Determine color based on XP level
    const getColor = (xpValue: number) => {
        if (xpValue < 15) return 'bg-red-500'; // Blacklisted
        if (xpValue < 50) return 'bg-accent-terracotta'; // Warning
        return 'bg-accent-cyan'; // Healthy
    };

    const xpPercentage = Math.min(Math.max(xp, 0), 100);

    return (
        <div className="w-full glass-panel rounded-xl p-6 flex flex-col items-center justify-center space-y-4">
            <h3 className="text-textSecondary text-sm uppercase tracking-widest font-semibold">Borrowing Reputation</h3>
            
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Background Track */}
                <svg className="absolute w-full h-full transform -rotate-90">
                    <circle 
                        cx="96" cy="96" r="80" 
                        stroke="currentColor" 
                        strokeWidth="12" 
                        fill="transparent" 
                        className="text-surfaceHighlight" 
                    />
                    {/* Progress Track */}
                    <circle 
                        cx="96" cy="96" r="80" 
                        stroke="currentColor" 
                        strokeWidth="12" 
                        fill="transparent"
                        strokeDasharray="502" // 2 * pi * r
                        strokeDashoffset={502 - (502 * xpPercentage) / 100}
                        className={`${getColor(xpPercentage).replace('bg-', 'text-')} transition-all duration-1000 ease-out`} 
                    />
                </svg>
                
                {/* Center Text */}
                <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-textPrimary">{xpPercentage}</span>
                    <span className="text-xs text-textSecondary uppercase mt-1">XP Points</span>
                </div>
            </div>

            <div className="text-center mt-2">
                {xpPercentage < 15 ? (
                    <p className="text-red-400 text-sm">Account restricted. Repay debt to restore.</p>
                ) : (
                    <p className="text-textSecondary text-sm">Status: <span className="text-textPrimary font-medium">{xpPercentage >= 50 ? 'Healthy' : 'At Risk'}</span></p>
                )}
            </div>
        </div>
    );
};
