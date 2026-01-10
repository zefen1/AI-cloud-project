// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Lottery {
    enum PrizeType {
        NOTHING,
        TOKEN,
        MAKEUP,
        BADGE
    }

    struct Prize {
        PrizeType prizeType;
        uint256 value;
        string name;
    }

    struct SpinRecord {
        uint256 timestamp;
        PrizeType prizeType;
        uint256 value;
    }

    mapping(address => uint256) public spinsAvailable;
    mapping(address => uint256) public totalSpins;
    mapping(address => SpinRecord[]) public spinHistory;

    Prize[8] public prizes;

    event SpinsAwarded(address indexed user, uint256 amount);
    event SpinCompleted(address indexed user, PrizeType prizeType, uint256 value);

    constructor() {
        // 初始化奖品池
        prizes[0] = Prize(PrizeType.TOKEN, 50 ether, "50代币");
        prizes[1] = Prize(PrizeType.MAKEUP, 1, "补卡次数");
        prizes[2] = Prize(PrizeType.TOKEN, 10 ether, "10代币");
        prizes[3] = Prize(PrizeType.NOTHING, 0, "谢谢参与");
        prizes[4] = Prize(PrizeType.TOKEN, 100 ether, "100代币");
        prizes[5] = Prize(PrizeType.BADGE, 1, "专属徽章");
        prizes[6] = Prize(PrizeType.TOKEN, 20 ether, "20代币");
        prizes[7] = Prize(PrizeType.MAKEUP, 1, "补卡次数");
    }

    function awardSpins(address user, uint256 amount) external {
        // TODO: Add access control
        spinsAvailable[user] += amount;
        emit SpinsAwarded(user, amount);
    }

    function spin() external returns (uint256 prizeIndex, Prize memory prize) {
        require(spinsAvailable[msg.sender] > 0, "No spins available");

        spinsAvailable[msg.sender]--;
        totalSpins[msg.sender]++;

        // 伪随机数生成（实际应使用 Chainlink VRF）
        prizeIndex = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, block.prevrandao, totalSpins[msg.sender]))
        ) % 8;

        prize = prizes[prizeIndex];

        spinHistory[msg.sender].push(SpinRecord({
            timestamp: block.timestamp,
            prizeType: prize.prizeType,
            value: prize.value
        }));

        // 发放奖励
        if (prize.prizeType == PrizeType.TOKEN) {
            // TODO: Transfer tokens
        } else if (prize.prizeType == PrizeType.MAKEUP) {
            // TODO: Award makeup to DailyCheckIn contract
        } else if (prize.prizeType == PrizeType.BADGE) {
            // TODO: Award badge NFT
        }

        emit SpinCompleted(msg.sender, prize.prizeType, prize.value);

        return (prizeIndex, prize);
    }

    function getSpinHistory(address user) external view returns (SpinRecord[] memory) {
        return spinHistory[user];
    }

    function getUserSpins(address user) external view returns (uint256 available, uint256 total) {
        return (spinsAvailable[user], totalSpins[user]);
    }
}
