import React, { useState } from 'react';

/**
 * @title LockingInterface
 * @author Viqtorhvayx
 * @dev UI for depositing assets and setting lock duration.
 */

export const LockingInterface: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [asset, setAsset] = useState('HBAR');
    const [duration, setDuration] = useState('3 Weeks');

    const handleLock = () => {
        // Smart contract interaction goes here
        console.log(`Locking ${amount} ${asset} for ${duration}`);
    };

    return (
        <div className="glass-panel rounded-xl p-6 flex flex-col space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-textPrimary">Save & Lock Assets</h2>
                <p className="text-textSecondary text-sm mt-1">Earn 0.3% yield every 3 weeks on HBAR.</p>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label className="text-sm text-textSecondary font-medium">Select Asset</label>
                    <select 
                        value={asset} 
                        onChange={(e) => setAsset(e.target.value)}
                        className="bg-surfaceHighlight border border-surface text-textPrimary rounded-lg p-3 outline-none focus:border-accent-cyan transition-colors"
                    >
                        <option value="HBAR">HBAR (Yield Bearing)</option>
                        <option value="USDC">USDC (No Yield)</option>
                        <option value="USDT">USDT (No Yield)</option>
                    </select>
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="text-sm text-textSecondary font-medium">Amount</label>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-surfaceHighlight border border-surface text-textPrimary rounded-lg p-3 outline-none focus:border-accent-cyan transition-colors"
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="text-sm text-textSecondary font-medium">Lock Duration</label>
                    <select 
                        value={duration} 
                        onChange={(e) => setDuration(e.target.value)}
                        className="bg-surfaceHighlight border border-surface text-textPrimary rounded-lg p-3 outline-none focus:border-accent-cyan transition-colors"
                    >
                        <option value="3 Weeks">3 Weeks</option>
                        <option value="6 Weeks">6 Weeks</option>
                        <option value="9 Weeks">9 Weeks</option>
                        <option value="12 Weeks">12 Weeks</option>
                    </select>
                </div>
            </div>

            <div className="bg-surface rounded-lg p-4 text-sm">
                <div className="flex justify-between text-textSecondary mb-2">
                    <span>Est. Yield:</span>
                    <span className="text-accent-cyan font-medium">
                        {asset === 'HBAR' && amount ? ((parseFloat(amount) * 0.003) * (parseInt(duration) / 3)).toFixed(4) : '0.00'} {asset}
                    </span>
                </div>
                <div className="flex justify-between text-textSecondary">
                    <span>Early Withdrawal Penalty:</span>
                    <span className="text-accent-terracotta">5% Strict</span>
                </div>
            </div>

            <button 
                onClick={handleLock}
                className="w-full bg-accent-cyan hover:bg-opacity-80 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
                Confirm Lock
            </button>
        </div>
    );
};
