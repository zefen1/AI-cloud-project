// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DailyCheckIn {
    struct Stake {
        uint256 amount;
        uint8 milestoneDays; // 30, 100, 200, 365
        bool isLocked; // true: 封存模式, false: 随时可取
        uint256 startTime;
        uint256 currentDay;
        uint256 lastCheckInTime;
        uint256 earnedInterest;
        uint256 redPackets;
        uint256 missedDays;
        uint256 remainingMakeups; // 剩余补卡次数
        bool completed;
    }

    struct CheckInRecord {
        uint256 timestamp;
        string content;
        uint256 redPacket;
    }

    mapping(address => Stake) public stakes;
    mapping(address => CheckInRecord[]) public checkInRecords;
    mapping(address => mapping(uint256 => bool)) public hasCheckedIn; // user => day => checked

    uint256 public constant DAILY_INTEREST_LOCKED = 500; // 5% for locked mode (basis points)
    uint256 public constant DAILY_INTEREST_FLEXIBLE = 250; // 2.5% for flexible mode
    uint256 public constant MAX_MAKEUPS = 3;
    uint256 public constant MIN_RED_PACKET = 5 ether;
    uint256 public constant MAX_RED_PACKET = 50 ether;

    event Staked(address indexed user, uint256 amount, uint8 milestone, bool isLocked);
    event CheckedIn(address indexed user, uint256 day, uint256 redPacket);
    event MadeUp(address indexed user, uint256 day);
    event Withdrawn(address indexed user, uint256 amount);

    function stake(uint256 amount, uint8 milestoneDays, bool isLocked) external {
        require(stakes[msg.sender].amount == 0, "Already staked");
        require(amount >= 1 ether && amount <= 1000 ether, "Invalid amount");
        require(
            milestoneDays == 30 ||
            milestoneDays == 100 ||
            milestoneDays == 200 ||
            milestoneDays == 365,
            "Invalid milestone"
        );

        stakes[msg.sender] = Stake({
            amount: amount,
            milestoneDays: milestoneDays,
            isLocked: isLocked,
            startTime: block.timestamp,
            currentDay: 0,
            lastCheckInTime: 0,
            earnedInterest: 0,
            redPackets: 0,
            missedDays: 0,
            remainingMakeups: MAX_MAKEUPS,
            completed: false
        });

        emit Staked(msg.sender, amount, milestoneDays, isLocked);
    }

    function checkIn(string memory content) external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No active stake");
        require(!userStake.completed, "Milestone already completed");
        require(bytes(content).length >= 200, "Content too short");

        uint256 daysSinceStart = (block.timestamp - userStake.startTime) / 1 days;
        require(!hasCheckedIn[msg.sender][daysSinceStart], "Already checked in today");
        require(
            userStake.lastCheckInTime == 0 ||
            block.timestamp - userStake.lastCheckInTime < 2 days,
            "Missed check-in, need makeup"
        );

        // 计算红包
        uint256 redPacket = _calculateRedPacket();

        // 计算利息
        uint256 interest = _calculateDailyInterest(userStake);

        userStake.currentDay += 1;
        userStake.lastCheckInTime = block.timestamp;
        userStake.earnedInterest += interest;
        userStake.redPackets += redPacket;
        hasCheckedIn[msg.sender][daysSinceStart] = true;

        checkInRecords[msg.sender].push(CheckInRecord({
            timestamp: block.timestamp,
            content: content,
            redPacket: redPacket
        }));

        // 检查是否完成里程碑
        if (userStake.currentDay >= userStake.milestoneDays) {
            userStake.completed = true;
        }

        emit CheckedIn(msg.sender, userStake.currentDay, redPacket);
    }

    function makeUp(uint8 taskType, string memory content) external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No active stake");
        require(userStake.remainingMakeups > 0, "No makeups remaining");
        require(taskType >= 1 && taskType <= 3, "Invalid task type");

        uint256 minLength = taskType == 1 ? 400 : (taskType == 2 ? 300 : 200);
        require(bytes(content).length >= minLength, "Content too short for makeup");

        userStake.remainingMakeups -= 1;
        userStake.missedDays += 1;
        userStake.currentDay += 1;
        userStake.lastCheckInTime = block.timestamp;

        emit MadeUp(msg.sender, userStake.currentDay);
    }

    function withdraw() external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No active stake");

        if (userStake.isLocked) {
            require(userStake.completed, "Milestone not completed yet");
        }

        uint256 totalAmount = userStake.amount + userStake.earnedInterest + userStake.redPackets;

        // Reset stake
        delete stakes[msg.sender];

        // TODO: Transfer tokens
        emit Withdrawn(msg.sender, totalAmount);
    }

    function getStakeInfo(address user) external view returns (Stake memory) {
        return stakes[user];
    }

    function getCheckInRecords(address user) external view returns (CheckInRecord[] memory) {
        return checkInRecords[user];
    }

    function _calculateRedPacket() private view returns (uint256) {
        // 伪随机数生成（实际应使用 Chainlink VRF）
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.prevrandao)));
        return MIN_RED_PACKET + (random % (MAX_RED_PACKET - MIN_RED_PACKET));
    }

    function _calculateDailyInterest(Stake memory userStake) private pure returns (uint256) {
        uint256 rate = userStake.isLocked ? DAILY_INTEREST_LOCKED : DAILY_INTEREST_FLEXIBLE;
        return (userStake.amount * rate) / 10000 / 365;
    }
}
