import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

/**
 * @title useMetaMask
 * @author Viqtorhvayx
 * @dev Hook to handle MetaMask connection to Hedera Testnet via Ethers.js.
 */
export const useMetaMask = () => {
    const [account, setAccount] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
            const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
            setProvider(browserProvider);

            // Check if already connected
            browserProvider.listAccounts().then((accounts) => {
                if (accounts.length > 0) setAccount(accounts[0].address);
            });
        }
    }, []);

    const connect = async () => {
        if (provider) {
            try {
                const accounts = await provider.send('eth_requestAccounts', []);
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            } catch (error) {
                console.error("User rejected request", error);
            }
        } else {
            console.error("MetaMask not installed");
        }
    };

    const disconnect = () => {
        setAccount(null);
    };

    return { account, provider, connect, disconnect };
};
