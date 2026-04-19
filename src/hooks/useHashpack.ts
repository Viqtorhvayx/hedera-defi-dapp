import { useState, useEffect } from 'react';
import { HashConnect, HashConnectTypes } from 'hashconnect';

/**
 * @title useHashpack
 * @author Viqtorhvayx
 * @dev Hook to handle Hashpack connection natively on Hedera Testnet.
 */

// Initialize outside component to prevent multiple instances
const hashconnect = new HashConnect();

export const useHashpack = () => {
    const [accountId, setAccountId] = useState<string | null>(null);
    const [pairingData, setPairingData] = useState<any>(null);

    const appMetadata: HashConnectTypes.AppMetadata = {
        name: "Hedera DeFi Vault",
        description: "A premium DeFi experience by Viqtorhvayx",
        icon: "https://cryptologos.cc/logos/hedera-hbar-logo.png"
    };

    useEffect(() => {
        const init = async () => {
            try {
                // Initialize Hashconnect
                const initData = await hashconnect.init(appMetadata, "testnet", false);
                
                if (initData.savedPairings.length > 0) {
                    setPairingData(initData.savedPairings[0]);
                    setAccountId(initData.savedPairings[0].accountIds[0]);
                }

                // Listen for pairing event
                hashconnect.pairingEvent.on((data) => {
                    setPairingData(data);
                    setAccountId(data.accountIds[0]);
                });
            } catch (e) {
                console.error("Failed to initialize HashConnect", e);
            }
        };
        init();

        return () => {
            hashconnect.pairingEvent.removeAllListeners();
        };
    }, []);

    const connect = () => {
        if (hashconnect) {
            hashconnect.connectToLocalWallet();
        }
    };

    const disconnect = () => {
        if (pairingData?.topic) {
            hashconnect.disconnect(pairingData.topic);
            setAccountId(null);
            setPairingData(null);
        }
    };

    return { accountId, connect, disconnect, hashconnect };
};
