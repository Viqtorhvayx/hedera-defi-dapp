// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LockingModule.sol"; // Using IERC20 from here

/**
 * @title BorrowingModule
 * @author Viqtorhvayx
 * @dev Module for borrowing HBAR against Stablecoin collateral.
 * Implements an XP Reputation System (0-100).
 */
contract BorrowingModule {
    address public owner;

    struct Borrower {
        uint8 xp; // 0 to 100
        uint256 totalDebtHbar;
        mapping(address => uint256) collateral;
        uint256 cooldownEnd;
    }

    struct Loan {
        uint256 amount;
        uint256 collateralAmount;
        address collateralToken;
        uint256 dueDate;
        bool active;
    }

    mapping(address => Borrower) public borrowers;
    mapping(address => mapping(uint256 => Loan)) public userLoans;
    mapping(address => uint256) public userLoanCount;

    // Price oracle simulation: How much HBAR per 1 token (e.g. 1 USDC = 10 HBAR)
    mapping(address => uint256) public tokenToHbarRate;

    uint8 public constant MIN_XP = 15;
    uint8 public constant MAX_XP = 100;
    uint256 public constant COOLDOWN_PERIOD = 7 days;

    event Borrowed(address indexed user, uint256 loanId, uint256 hbarAmount, uint256 collateralAmount, address collateralToken);
    event Repaid(address indexed user, uint256 loanId, uint256 hbarAmount);
    event XPUpdated(address indexed user, uint8 newXp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setOracleRate(address _token, uint256 _rate) external onlyOwner {
        tokenToHbarRate[_token] = _rate;
    }

    /**
     * @dev Get max LTV (basis points) based on XP
     */
    function getLTV(uint8 xp) public pure returns (uint256) {
        if (xp < MIN_XP) return 0;
        // e.g. 15 XP = 30% LTV, 100 XP = 80% LTV
        // Linear scale between 3000 (30%) and 8000 (80%)
        return 3000 + ((uint256(xp) - MIN_XP) * 5000) / (MAX_XP - MIN_XP);
    }

    /**
     * @dev Get max loan duration based on XP
     */
    function getMaxDuration(uint8 xp) public pure returns (uint256) {
        if (xp < MIN_XP) return 0;
        // 15 XP = 7 days, 100 XP = 90 days
        return 7 days + ((uint256(xp) - MIN_XP) * 83 days) / (MAX_XP - MIN_XP);
    }

    function initializeBorrower(address _user) internal {
        if (borrowers[_user].xp == 0 && borrowers[_user].cooldownEnd == 0) {
            borrowers[_user].xp = 50; // Starting XP
        }
    }

    function borrow(address _collateralToken, uint256 _collateralAmount, uint256 _duration) external {
        initializeBorrower(msg.sender);
        Borrower storage b = borrowers[msg.sender];

        require(b.xp >= MIN_XP, "XP too low, blacklisted");
        require(block.timestamp >= b.cooldownEnd, "In cooldown");
        require(_duration <= getMaxDuration(b.xp), "Duration exceeds max allowed for XP");
        require(tokenToHbarRate[_collateralToken] > 0, "Unsupported collateral");

        // Calculate max borrowable HBAR
        uint256 hbarValue = (_collateralAmount * tokenToHbarRate[_collateralToken]);
        uint256 maxBorrow = (hbarValue * getLTV(b.xp)) / 10000;

        require(address(this).balance >= maxBorrow, "Insufficient protocol liquidity");

        // Take collateral
        IERC20(_collateralToken).transferFrom(msg.sender, address(this), _collateralAmount);
        b.collateral[_collateralToken] += _collateralAmount;

        // Create loan
        uint256 loanId = userLoanCount[msg.sender]++;
        userLoans[msg.sender][loanId] = Loan({
            amount: maxBorrow,
            collateralAmount: _collateralAmount,
            collateralToken: _collateralToken,
            dueDate: block.timestamp + _duration,
            active: true
        });

        b.totalDebtHbar += maxBorrow;

        // Send HBAR
        payable(msg.sender).transfer(maxBorrow);

        emit Borrowed(msg.sender, loanId, maxBorrow, _collateralAmount, _collateralToken);
    }

    function repay(uint256 _loanId) external payable {
        Loan storage loan = userLoans[msg.sender][_loanId];
        Borrower storage b = borrowers[msg.sender];
        require(loan.active, "Loan not active");
        require(msg.value >= loan.amount, "Insufficient repayment");

        loan.active = false;
        b.totalDebtHbar -= loan.amount;

        // Return collateral
        IERC20(loan.collateralToken).transfer(msg.sender, loan.collateralAmount);
        b.collateral[loan.collateralToken] -= loan.collateralAmount;

        // Refund excess HBAR if any
        if (msg.value > loan.amount) {
            payable(msg.sender).transfer(msg.value - loan.amount);
        }

        // Adjust XP
        if (block.timestamp > loan.dueDate) {
            // Late repayment, slash XP
            uint8 slash = 20;
            if (b.xp > slash) {
                b.xp -= slash;
            } else {
                b.xp = 0;
            }
            if (b.xp < MIN_XP) {
                b.cooldownEnd = block.timestamp + COOLDOWN_PERIOD; // Cooldown applied
            }
        } else {
            // On time repayment, boost XP
            if (b.xp < MAX_XP) {
                b.xp += 5;
                if (b.xp > MAX_XP) b.xp = MAX_XP;
            }
        }

        emit Repaid(msg.sender, _loanId, loan.amount);
        emit XPUpdated(msg.sender, b.xp);
    }

    receive() external payable {}
}
