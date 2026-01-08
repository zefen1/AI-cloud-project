'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface TaskDetail {
  id: string;
  name: string;
  location: string;
  description: string;
  requirements: string[];
  verificationKey: string;
  deadline: string;
  minStake: number;
  maxStake: number;
  dailyInterest: number;
  totalReward: number;
  participants: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'completed' | 'expired';
}

// 用户参与状态
type UserStatus = 'not_joined' | 'staked' | 'checked_in' | 'completed';

export default function SpotTaskDetailPage() {
  const params = useParams();
  const taskId = params.taskId as string;

  // TODO: 从智能合约获取数据
  const [task] = useState<TaskDetail>({
    id: taskId,
    name: '长城打卡挑战',
    location: '北京 · 八达岭',
    description:
      '八达岭长城是明长城最具代表性的一段，也是保存最完好的长城段落。登上长城，感受古代劳动人民的智慧与力量，俯瞰壮美山河。',
    requirements: [
      '在八达岭长城主景区拍照打卡',
      '照片中需清晰显示长城城墙',
      '上传至少3张不同角度的照片',
      '输入景区门票上的验证码',
    ],
    verificationKey: '景区门票验证码',
    deadline: '2026-02-01',
    minStake: 100,
    maxStake: 1000,
    dailyInterest: 5,
    totalReward: 1500,
    participants: 128,
    difficulty: 'medium',
    status: 'active',
  });

  const [userStatus, setUserStatus] = useState<UserStatus>('not_joined');
  const [stakeAmount, setStakeAmount] = useState(100);
  const [photos, setPhotos] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStake = async () => {
    if (stakeAmount < task.minStake || stakeAmount > task.maxStake) {
      alert(`质押金额需在 ${task.minStake}-${task.maxStake} 代币之间`);
      return;
    }

    setIsSubmitting(true);
    // TODO: 调用智能合约质押
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setUserStatus('staked');
    alert('质押成功！');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // TODO: 实际上传到 IPFS 或其他存储
    const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
    setPhotos([...photos, ...newPhotos].slice(0, 5)); // 最多5张
  };

  const handleCheckIn = async () => {
    if (photos.length < 3) {
      alert('请至少上传3张照片');
      return;
    }

    if (!verificationCode) {
      alert('请输入验证码');
      return;
    }

    setIsSubmitting(true);
    // TODO: 调用智能合约提交打卡
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setUserStatus('checked_in');
    alert('打卡提交成功，等待审核');
  };

  const handleClaimReward = async () => {
    setIsSubmitting(true);
    // TODO: 调用智能合约领取奖励
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setUserStatus('completed');
    alert('奖励领取成功！');
  };

  const calculateEarnings = () => {
    const daysRemaining = Math.ceil(
      (new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    const interest = (stakeAmount * task.dailyInterest * daysRemaining) / 100;
    return {
      principal: stakeAmount,
      interest: interest,
      reward: task.totalReward,
      total: stakeAmount + interest + task.totalReward,
    };
  };

  const earnings = calculateEarnings();

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="w-full px-6 py-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex items-center gap-4">
          <Link
            href="/spot-checkin"
            className="flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-300"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-2xl font-bold">{task.name}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 任务信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 景点图片 */}
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="h-80 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-white/20">
                  landscape
                </span>
              </div>
            </div>

            {/* 任务描述 */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                景点介绍
              </h2>
              <p className="text-gray-400 leading-relaxed">{task.description}</p>

              <div className="pt-4 border-t border-white/10 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">
                    location_on
                  </span>
                  <span className="text-gray-400">{task.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">
                    schedule
                  </span>
                  <span className="text-gray-400">截止: {task.deadline}</span>
                </div>
              </div>
            </div>

            {/* 打卡要求 */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  checklist
                </span>
                打卡要求
              </h2>
              <ul className="space-y-3">
                {task.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-400">
                    <span className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 打卡操作 */}
            {userStatus === 'staked' && (
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    photo_camera
                  </span>
                  上传打卡照片
                </h2>

                {/* 照片预览 */}
                <div className="grid grid-cols-3 gap-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-black/30">
                      <img src={photo} alt={`打卡照片 ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {photos.length < 5 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-white/20 hover:border-primary transition-colors cursor-pointer flex items-center justify-center">
                      <div className="text-center">
                        <span className="material-symbols-outlined text-3xl text-white/40">
                          add_photo_alternate
                        </span>
                        <p className="text-xs text-gray-500 mt-1">添加照片</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  已上传 {photos.length}/5 张照片（至少需要3张）
                </p>

                {/* 验证码输入 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    {task.verificationKey}
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="请输入验证码"
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                {/* 提交按钮 */}
                <button
                  onClick={handleCheckIn}
                  disabled={isSubmitting || photos.length < 3 || !verificationCode}
                  className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-background-dark px-8 py-4 rounded-full font-bold text-lg tracking-wide transition-all duration-300 hover:scale-105 animate-glow shadow-[0_0_20px_rgba(37,244,120,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:animate-none"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">
                        progress_activity
                      </span>
                      <span>提交中...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">send</span>
                      <span>提交打卡</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* 审核中 */}
            {userStatus === 'checked_in' && (
              <div className="glass-panel p-8 rounded-xl text-center space-y-4">
                <div className="size-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-5xl text-yellow-500">
                    pending
                  </span>
                </div>
                <h3 className="text-xl font-bold">审核中</h3>
                <p className="text-gray-400">
                  你的打卡已提交，正在审核中。审核通过后即可领取奖励。
                </p>
              </div>
            )}
          </div>

          {/* Right Column - 质押和奖励 */}
          <div className="space-y-6">
            {/* 任务统计 */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-bold">任务统计</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">参与人数</span>
                  <span className="font-bold">{task.participants} 人</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">每日利息</span>
                  <span className="font-bold text-primary">{task.dailyInterest}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">总奖励池</span>
                  <span className="font-bold text-primary">{task.totalReward} 代币</span>
                </div>
              </div>
            </div>

            {/* 质押操作 */}
            {userStatus === 'not_joined' && (
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    account_balance_wallet
                  </span>
                  质押参与
                </h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    质押金额
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(Number(e.target.value))}
                      min={task.minStake}
                      max={task.maxStake}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 pr-16 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      代币
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    范围: {task.minStake} - {task.maxStake} 代币
                  </p>
                </div>

                {/* 预期收益 */}
                <div className="glass-panel p-4 rounded-lg space-y-2">
                  <p className="text-xs text-gray-400">预期收益</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">质押本金</span>
                      <span className="font-bold">{earnings.principal} 代币</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">利息收益</span>
                      <span className="font-bold text-primary">
                        +{earnings.interest.toFixed(2)} 代币
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">任务奖励</span>
                      <span className="font-bold text-primary">
                        +{earnings.reward} 代币
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between">
                      <span className="text-gray-400">总计</span>
                      <span className="font-bold text-xl text-primary">
                        {earnings.total.toFixed(2)} 代币
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStake}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-background-dark px-6 py-4 rounded-full font-bold text-base tracking-wide transition-all duration-300 hover:scale-105 animate-glow shadow-[0_0_20px_rgba(37,244,120,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">
                        progress_activity
                      </span>
                      <span>质押中...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">lock</span>
                      <span>确认质押</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* 已质押状态 */}
            {userStatus === 'staked' && (
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  已质押
                </h3>
                <div className="glass-panel p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">质押金额</span>
                    <span className="font-bold">{stakeAmount} 代币</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">当前状态</span>
                    <span className="font-bold text-yellow-500">等待打卡</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  请前往景点完成打卡，上传照片和验证码
                </p>
              </div>
            )}

            {/* 领取奖励 */}
            {userStatus === 'checked_in' && (
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    redeem
                  </span>
                  待领取奖励
                </h3>

                <div className="glass-panel p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-400 mb-2">可领取金额</p>
                  <p className="text-3xl font-bold text-primary">
                    {earnings.total.toFixed(2)}
                    <span className="text-sm ml-2 text-gray-400">代币</span>
                  </p>
                </div>

                <button
                  onClick={handleClaimReward}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-background-dark px-6 py-4 rounded-full font-bold text-base tracking-wide transition-all duration-300 hover:scale-105"
                >
                  <span className="material-symbols-outlined">redeem</span>
                  <span>领取奖励</span>
                </button>
              </div>
            )}

            {/* 说明 */}
            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">
                  info
                </span>
                参与流程
              </h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">1.</span>
                  <span>质押代币参与任务</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">2.</span>
                  <span>前往景点完成打卡</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">3.</span>
                  <span>上传照片和验证码</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">4.</span>
                  <span>审核通过后领取奖励</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
