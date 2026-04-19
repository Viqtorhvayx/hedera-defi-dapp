// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LockingModule.sol"; // Using IERC20 from here for simplicity

/**
 * @title LendingModule
 * @author Viqtorhvayx
 * @dev Module for providing liquidity. Implements a "Points System" instead of monetary yield.
 * Points = Volume * Duration
 */
contract LendingModule {
    address public owner;

    struct Provider {
        uint256 hbarProvided;
        mapping(address => uint256) stablecoinsProvided;
        uint256 lastUpdateTimestamp;
        uint256 accumulatedPoints;
    }

    mapping(address => Provider) public providers;

    event LiquidityProvided(address indexed user, uint256 amount, bool isHbar, address tokenAddress);
    event LiquidityWithdrawn(address indexed user, uint256 amount, bool isHbar, address tokenAddress);
    event PointsConverted(address indexed user, uint256 pointsBurned, uint256 rewardAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Update points before modifying balance
     */
    function _updatePoints(address _user) internal {
        Provider storage p = providers[_user];
        if (p.lastUpdateTimestamp > 0) {
            uint256 duration = block.timestamp - p.lastUpdateTimestamp;
            // Simplified volume calculation (sum of all balances). 
            // In a real dApp, stablecoins and HBAR might have different point weights.
            uint256 volume = p.hbarProvided; 
            // We would iterate stablecoins here if there was an array, 
            // but for simplicity we'll just track total abstract "volume" if needed.
            
            p.accumulatedPoints += (volume * duration) / 1 days; // points per day per volume unit
        }
        p.lastUpdateTimestamp = block.timestamp;
    }

    function provideHBAR() external payable {
        require(msg.value > 0, "Must provide > 0");
        _updatePoints(msg.sender);
        providers[msg.sender].hbarProvided += msg.value;
        emit LiquidityProvided(msg.sender, msg.value, true, address(0));
    }

    function provideStablecoin(address _token, uint256 _amount) external {
        require(_amount > 0, "Must provide > 0");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        _updatePoints(msg.sender);
        providers[msg.sender].stablecoinsProvided[_token] += _amount;
        emit LiquidityProvided(msg.sender, _amount, false, _token);
    }

    function withdrawHBAR(uint256 _amount) external {
        _updatePoints(msg.sender);
        require(providers[msg.sender].hbarProvided >= _amount, "Insufficient liquidity");
        providers[msg.sender].hbarProvided -= _amount;
        payable(msg.sender).transfer(_amount);
        emit LiquidityWithdrawn(msg.sender, _amount, true, address(0));
    }

    /**
     * @dev Admin function to convert accumulated points into yield
     */
    function convertPointsToYield(address _user, uint256 _pointsToConvert, uint256 _rewardHbar) external onlyOwner {
        Provider storage p = providers[_user];
        _updatePoints(_user);
        require(p.accumulatedPoints >= _pointsToConvert, "Insufficient points");
        
        p.accumulatedPoints -= _pointsToConvert;
        payable(_user).transfer(_rewardHbar);
        
        emit PointsConverted(_user, _pointsToConvert, _rewardHbar);
    }

    // Admin can fund the contract to pay out point rewards
    receive() external payable {}
}
