"use client";

import React from 'react';
import { XPGauge } from './XPGauge';
import { LockingInterface } from './LockingInterface';
import { LendingBorrowingInterface } from './LendingBorrowingInterface';
import { useMetaMask } from '../hooks/useMetaMask';
import { useHashpack } from '../hooks/useHashpack';

/**
 * @title Dashboard
 * @author Viqtorhvayx
 * @dev Main application layout combining all modules.
 */

export const Dashboard: React.FC = () => {
    const { account: metaMaskAccount, connect: connectMetaMask, disconnect: disconnectMetaMask } = useMetaMask();
    const { accountId: hashpackAccount, connect: connectHashpack, disconnect: disconnectHashpack } = useHashpack();

    const mockXP = 65; // Mock XP for demonstration

    return (
        <div className="min-h-screen bg-background text-textPrimary p-4 md:p-8 font-sans">
            <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-surfaceHighlight pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Hedera DeFi Vault</h1>
                    <p className="text-textSecondary mt-1 text-sm">Engineered by Viqtorhvayx</p>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    {/* MetaMask Button */}
                    {!metaMaskAccount ? (
                        <button 
                            onClick={connectMetaMask}
                            className="px-6 py-2 rounded-full border border-surfaceHighlight hover:border-accent-terracotta text-sm font-medium transition-colors bg-surface"
                        >
                            Connect EVM
                        </button>
                    ) : (
                        <button 
                            onClick={disconnectMetaMask}
                            className="px-6 py-2 rounded-full border border-accent-terracotta text-sm font-medium text-accent-terracotta bg-surface"
                        >
                            {metaMaskAccount.slice(0, 6)}...{metaMaskAccount.slice(-4)}
                        </button>
                    )}

                    {/* Hashpack Button */}
                    {!hashpackAccount ? (
                        <button 
                            onClick={connectHashpack}
                            className="px-6 py-2 rounded-full border border-surfaceHighlight hover:border-accent-cyan text-sm font-medium transition-colors bg-surface"
                        >
                            Connect HashPack
                        </button>
                    ) : (
                        <button 
                            onClick={disconnectHashpack}
                            className="px-6 py-2 rounded-full border border-accent-cyan text-sm font-medium text-accent-cyan bg-surface"
                        >
                            {hashpackAccount}
                        </button>
                    )}
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-8">
                    <XPGauge xp={mockXP} />
                    
                    <div className="glass-panel rounded-xl p-6">
                        <h3 className="text-textSecondary text-sm uppercase tracking-widest font-semibold mb-4">Your Balances</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-lg">HBAR</span>
                                <span className="text-xl">12,450.00</span>
                            </div>
                            <div className="flex justify-between items-center text-textSecondary">
                                <span>USDC</span>
                                <span>1,200.00</span>
                            </div>
                            <div className="flex justify-between items-center text-textSecondary">
                                <span>USDT</span>
                                <span>500.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <LockingInterface />
                    <LendingBorrowingInterface />
                </div>
            </main>
        </div>
    );
};
