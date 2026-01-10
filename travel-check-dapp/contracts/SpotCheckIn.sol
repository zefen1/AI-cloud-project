// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SpotCheckIn {
    struct SpotTask {
        uint256 id;
        string name;
        string location;
        string description;
        uint256 minStake;
        uint256 maxStake;
        uint256 dailyInterest; // basis points
        uint256 totalReward;
        uint256 deadline;
        bool active;
        uint256 participants;
    }

    struct UserTask {
        uint256 taskId;
        uint256 stakeAmount;
        uint256 startTime;
        uint256 earnedInterest;
        string[] photos;
        string verificationCode;
        bool submitted;
        bool approved;
        bool claimed;
    }

    mapping(uint256 => SpotTask) public spotTasks;
    mapping(address => mapping(uint256 => UserTask)) public userTasks;
    uint256 public taskCount;

    event TaskCreated(uint256 indexed taskId, string name, uint256 totalReward);
    event TaskJoined(address indexed user, uint256 indexed taskId, uint256 amount);
    event CheckInSubmitted(address indexed user, uint256 indexed taskId);
    event CheckInApproved(address indexed user, uint256 indexed taskId);
    event RewardClaimed(address indexed user, uint256 indexed taskId, uint256 amount);

    function createTask(
        string memory name,
        string memory location,
        string memory description,
        uint256 minStake,
        uint256 maxStake,
        uint256 dailyInterest,
        uint256 totalReward,
        uint256 deadline
    ) external {
        taskCount++;
        spotTasks[taskCount] = SpotTask({
            id: taskCount,
            name: name,
            location: location,
            description: description,
            minStake: minStake,
            maxStake: maxStake,
            dailyInterest: dailyInterest,
            totalReward: totalReward,
            deadline: deadline,
            active: true,
            participants: 0
        });

        emit TaskCreated(taskCount, name, totalReward);
    }

    function joinTask(uint256 taskId, uint256 amount) external {
        SpotTask storage task = spotTasks[taskId];
        require(task.active, "Task not active");
        require(block.timestamp < task.deadline, "Task expired");
        require(amount >= task.minStake && amount <= task.maxStake, "Invalid stake amount");
        require(userTasks[msg.sender][taskId].stakeAmount == 0, "Already joined");

        userTasks[msg.sender][taskId] = UserTask({
            taskId: taskId,
            stakeAmount: amount,
            startTime: block.timestamp,
            earnedInterest: 0,
            photos: new string[](0),
            verificationCode: "",
            submitted: false,
            approved: false,
            claimed: false
        });

        task.participants++;

        emit TaskJoined(msg.sender, taskId, amount);
    }

    function submitCheckIn(
        uint256 taskId,
        string[] memory photos,
        string memory verificationCode
    ) external {
        UserTask storage userTask = userTasks[msg.sender][taskId];
        require(userTask.stakeAmount > 0, "Not joined this task");
        require(!userTask.submitted, "Already submitted");
        require(photos.length >= 3 && photos.length <= 5, "Invalid photo count");

        userTask.photos = photos;
        userTask.verificationCode = verificationCode;
        userTask.submitted = true;

        // 计算利息
        SpotTask storage task = spotTasks[taskId];
        uint256 daysStaked = (block.timestamp - userTask.startTime) / 1 days;
        userTask.earnedInterest = (userTask.stakeAmount * task.dailyInterest * daysStaked) / 10000;

        emit CheckInSubmitted(msg.sender, taskId);
    }

    function approveCheckIn(address user, uint256 taskId) external {
        // TODO: Add admin/oracle role
        UserTask storage userTask = userTasks[user][taskId];
        require(userTask.submitted, "Not submitted yet");
        require(!userTask.approved, "Already approved");

        userTask.approved = true;

        emit CheckInApproved(user, taskId);
    }

    function claimReward(uint256 taskId) external {
        UserTask storage userTask = userTasks[msg.sender][taskId];
        SpotTask storage task = spotTasks[taskId];

        require(userTask.approved, "Not approved yet");
        require(!userTask.claimed, "Already claimed");

        uint256 totalAmount = userTask.stakeAmount + userTask.earnedInterest + task.totalReward;
        userTask.claimed = true;

        // TODO: Transfer tokens
        emit RewardClaimed(msg.sender, taskId, totalAmount);
    }

    function getTask(uint256 taskId) external view returns (SpotTask memory) {
        return spotTasks[taskId];
    }

    function getUserTask(address user, uint256 taskId) external view returns (UserTask memory) {
        return userTasks[user][taskId];
    }

    function getAllTasks() external view returns (SpotTask[] memory) {
        SpotTask[] memory tasks = new SpotTask[](taskCount);
        for (uint256 i = 1; i <= taskCount; i++) {
            tasks[i - 1] = spotTasks[i];
        }
        return tasks;
    }
}
