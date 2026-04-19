// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LockingModule
 * @author Viqtorhvayx
 * @dev Module for saving/locking HBAR and Stablecoins on Hedera Testnet.
 * Users can deposit assets, set a withdrawal date.
 * HBAR accrues 0.3% yield every 3 weeks. Stablecoins do not.
 * 5% early withdrawal penalty sent to the treasury.
 */

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract LockingModule {
    address public owner;
    address public treasury;

    struct LockData {
        uint256 amount;
        uint256 lockTimestamp;
        uint256 unlockTimestamp;
        bool isHbar;
        address tokenAddress; // zero address if HBAR
        bool active;
    }

    // Mapping from user to their lock ID to LockData
    mapping(address => mapping(uint256 => LockData)) public userLocks;
    mapping(address => uint256) public userLockCount;

    uint256 public constant HBAR_YIELD_BPS = 30; // 0.3% = 30 basis points
    uint256 public constant YIELD_INTERVAL = 3 weeks;
    uint256 public constant PENALTY_BPS = 500; // 5% = 500 basis points
    uint256 public constant BPS_DENOMINATOR = 10000;

    event Locked(address indexed user, uint256 lockId, uint256 amount, uint256 unlockTimestamp, bool isHbar, address tokenAddress);
    event Withdrawn(address indexed user, uint256 lockId, uint256 amount, uint256 yield, bool penaltyApplied);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _treasury) {
        owner = msg.sender;
        treasury = _treasury;
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    /**
     * @dev Lock HBAR
     */
    function lockHBAR(uint256 _unlockTimestamp) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(_unlockTimestamp > block.timestamp, "Unlock time must be in future");

        uint256 lockId = userLockCount[msg.sender]++;
        userLocks[msg.sender][lockId] = LockData({
            amount: msg.value,
            lockTimestamp: block.timestamp,
            unlockTimestamp: _unlockTimestamp,
            isHbar: true,
            tokenAddress: address(0),
            active: true
        });

        emit Locked(msg.sender, lockId, msg.value, _unlockTimestamp, true, address(0));
    }

    /**
     * @dev Lock Stablecoins (USDT/USDC via HTS/ERC20)
     */
    function lockStablecoin(address _token, uint256 _amount, uint256 _unlockTimestamp) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(_unlockTimestamp > block.timestamp, "Unlock time must be in future");
        
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);

        uint256 lockId = userLockCount[msg.sender]++;
        userLocks[msg.sender][lockId] = LockData({
            amount: _amount,
            lockTimestamp: block.timestamp,
            unlockTimestamp: _unlockTimestamp,
            isHbar: false,
            tokenAddress: _token,
            active: true
        });

        emit Locked(msg.sender, lockId, _amount, _unlockTimestamp, false, _token);
    }

    /**
     * @dev Withdraw locked assets. Applies penalty if early, calculates yield if HBAR and mature.
     */
    function withdraw(uint256 _lockId) external {
        LockData storage lockInfo = userLocks[msg.sender][_lockId];
        require(lockInfo.active, "Lock is not active");

        lockInfo.active = false;

        bool isEarly = block.timestamp < lockInfo.unlockTimestamp;
        uint256 principal = lockInfo.amount;
        uint256 payout = principal;
        uint256 yieldAmount = 0;
        uint256 penaltyAmount = 0;

        if (isEarly) {
            // Apply 5% penalty
            penaltyAmount = (principal * PENALTY_BPS) / BPS_DENOMINATOR;
            payout = principal - penaltyAmount;
        } else {
            // Calculate yield if HBAR
            if (lockInfo.isHbar) {
                uint256 intervals = (block.timestamp - lockInfo.lockTimestamp) / YIELD_INTERVAL;
                // Yield is 0.3% of principal per 3-week interval
                yieldAmount = (principal * HBAR_YIELD_BPS * intervals) / BPS_DENOMINATOR;
                payout = principal + yieldAmount;
            }
        }

        if (lockInfo.isHbar) {
            if (penaltyAmount > 0) {
                payable(treasury).transfer(penaltyAmount);
            }
            // In a real scenario, the contract must have enough HBAR balance to pay the yield.
            payable(msg.sender).transfer(payout);
        } else {
            if (penaltyAmount > 0) {
                IERC20(lockInfo.tokenAddress).transfer(treasury, penaltyAmount);
            }
            IERC20(lockInfo.tokenAddress).transfer(msg.sender, payout);
        }

        emit Withdrawn(msg.sender, _lockId, payout, yieldAmount, isEarly);
    }

    // Fallback to receive HBAR (e.g., to fund yield payouts)
    receive() external payable {}
}
