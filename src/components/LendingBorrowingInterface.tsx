import React, { useState } from 'react';

/**
 * @title LendingBorrowingInterface
 * @author Viqtorhvayx
 * @dev Unified UI for providing liquidity and borrowing HBAR.
 */

export const LendingBorrowingInterface: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'LEND' | 'BORROW'>('LEND');
    const [amount, setAmount] = useState('');
    const [asset, setAsset] = useState('HBAR');

    return (
        <div className="glass-panel rounded-xl p-6 flex flex-col space-y-6">
            <div className="flex border-b border-surfaceHighlight">
                <button 
                    onClick={() => setActiveTab('LEND')}
                    className={`flex-1 pb-3 text-center font-medium transition-colors ${activeTab === 'LEND' ? 'text-accent-cyan border-b-2 border-accent-cyan' : 'text-textSecondary hover:text-textPrimary'}`}
                >
                    Provide Liquidity
                </button>
                <button 
                    onClick={() => setActiveTab('BORROW')}
                    className={`flex-1 pb-3 text-center font-medium transition-colors ${activeTab === 'BORROW' ? 'text-accent-terracotta border-b-2 border-accent-terracotta' : 'text-textSecondary hover:text-textPrimary'}`}
                >
                    Borrow HBAR
                </button>
            </div>

            {activeTab === 'LEND' ? (
                <div className="space-y-4 fade-in">
                    <p className="text-sm text-textSecondary mb-4">Provide liquidity to earn Points based on volume and duration.</p>
                    
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-textSecondary font-medium">Asset to Supply</label>
                        <select 
                            value={asset} 
                            onChange={(e) => setAsset(e.target.value)}
                            className="bg-surfaceHighlight border border-surface text-textPrimary rounded-lg p-3 outline-none focus:border-accent-cyan transition-colors"
                        >
                            <option value="HBAR">HBAR</option>
                            <option value="USDC">USDC</option>
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

                    <div className="bg-surface rounded-lg p-4 text-sm mt-4">
                        <div className="flex justify-between text-textSecondary">
                            <span>Expected Points/Day:</span>
                            <span className="text-accent-cyan font-medium">{amount ? (parseFloat(amount) * 0.5).toFixed(2) : '0.00'} pts</span>
                        </div>
                    </div>

                    <button className="w-full bg-accent-cyan hover:bg-opacity-80 text-white font-medium py-3 rounded-lg transition-all duration-200 mt-4">
                        Supply Liquidity
                    </button>
                </div>
            ) : (
                <div className="space-y-4 fade-in">
                    <p className="text-sm text-textSecondary mb-4">Borrow HBAR by depositing stablecoins. Your XP determines LTV.</p>
                    
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-textSecondary font-medium">Collateral Asset</label>
                        <select 
                            className="bg-surfaceHighlight border border-surface text-textPrimary rounded-lg p-3 outline-none focus:border-accent-terracotta transition-colors"
                        >
                            <option value="USDC">USDC</option>
                            <option value="USDT">USDT</option>
                        </select>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-textSecondary font-medium">Collateral Amount</label>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="bg-surfaceHighlight border border-surface text-textPrimary rounded-lg p-3 outline-none focus:border-accent-terracotta transition-colors"
                        />
                    </div>

                    <div className="bg-surface rounded-lg p-4 text-sm mt-4 space-y-2">
                        <div className="flex justify-between text-textSecondary">
                            <span>Max Borrowable (Based on XP):</span>
                            <span className="text-textPrimary font-medium">{amount ? (parseFloat(amount) * 10 * 0.5).toFixed(2) : '0.00'} HBAR</span>
                        </div>
                        <div className="flex justify-between text-textSecondary">
                            <span>Max Duration:</span>
                            <span className="text-textPrimary font-medium">30 Days</span>
                        </div>
                    </div>

                    <button className="w-full bg-accent-terracotta hover:bg-opacity-80 text-white font-medium py-3 rounded-lg transition-all duration-200 mt-4">
                        Borrow HBAR
                    </button>
                </div>
            )}
        </div>
    );
};
