# Hedera DeFi Vault

**Engineered by [Viqtorhvayx](https://github.com/Viqtorhvayx)**

A state-of-the-art decentralized application (dApp) built for the Hedera Testnet. This platform provides users with premium Web3 functionality including structured Savings/Locking, Liquidity Lending, and a Collateralized Borrowing protocol featuring an innovative dynamic XP Reputation System.

## Features

### 1. Saving & Locking
- Deposit and time-lock Native HBAR or Stablecoins (USDC/USDT).
- **HBAR Staking Advantage:** Earn a strict 0.3% yield increase every exactly 3 weeks.
- **Early Withdrawal:** Users attempting to break a lock before the preset time suffer a 5% penalty, automatically routed to the protocol Treasury.

### 2. Lending (Liquidity Provision)
- Supply HBAR or Stablecoins to the protocol's liquidity pools.
- **Points System:** Instead of standard monetary yield, users accumulate Points calculated based on their liquidity volume multiplied by duration.
- Points can be tracked and later converted to rewards by the protocol administrators.

### 3. Borrowing & Reputation
- Borrow HBAR by supplying Stablecoins as collateral.
- **XP Mechanics:** Borrowers have an XP rating (0-100). This dictates their maximum Loan-to-Value (LTV) ratio and maximum borrow duration.
- Late repayments or defaults slash XP. If XP drops below 15, the account is blacklisted from new borrows and must undergo a cooldown period to regenerate.

### 4. Dual Wallet Support
- **EVM Compatibility:** Integrated with Wagmi/Ethers to allow standard connection via MetaMask to the Hedera Testnet.
- **Native Support:** Integrated with HashConnect to support native Hedera wallets like HashPack seamlessly.

## Tech Stack
- **Smart Contracts:** Solidity (Hedera Smart Contract Service)
- **Frontend Framework:** Next.js (React)
- **Styling:** Tailwind CSS (Dark Mode & Premium Aesthetics)
- **Web3 Integrations:** Ethers.js, HashConnect

## Setup Instructions

### Frontend
1. Navigate to the project directory.
2. Install dependencies (assuming a standard Next.js environment): `npm install`
3. Add any necessary environment variables.
4. Run the development server: `npm run dev`

### Smart Contracts
1. Navigate to the `contracts` folder.
2. Deploy the `LockingModule.sol`, `LendingModule.sol`, and `BorrowingModule.sol` via Hardhat or Remix targeting the Hedera Testnet RPC.

---
*Created by [Viqtorhvayx](https://github.com/Viqtorhvayx)*
