'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUpload from '@/components/checkin/image-upload';
import {
  uploadImageToIPFS,
  uploadCheckInDataToIPFS,
  prepareOnChainData,
  type CheckInData
} from '@/lib/utils/ipfs';

export default function TaskPage() {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRedPacket, setShowRedPacket] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const minWords = 200;
  const currentWords = content.length;
  const isValid = currentWords >= minWords;

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    setUploadProgress('准备上传数据...');

    try {
      let imageHash: string | undefined;

      // 1. 如果有图片，先上传图片到 IPFS
      if (selectedImage) {
        setUploadProgress('正在上传图片到 IPFS...');
        imageHash = await uploadImageToIPFS(selectedImage);
        console.log('📸 图片 IPFS Hash:', imageHash);
      }

      // 2. 组合打卡数据
      const checkInData: CheckInData = {
        text: content,
        imageHash,
        timestamp: Date.now(),
        // 可以添加位置信息（如果需要）
        // location: { lat: 0, lng: 0 }
      };

      // 3. 上传打卡数据到 IPFS
      setUploadProgress('正在上传打卡数据到 IPFS...');
      const dataHash = await uploadCheckInDataToIPFS(checkInData);
      console.log('📝 打卡数据 IPFS Hash:', dataHash);

      // 4. 准备链上数据
      const onChainData = prepareOnChainData(dataHash);
      console.log('⛓️  链上数据:', onChainData);

      // 5. 调用智能合约提交
      setUploadProgress('正在提交到区块链...');

      // 导入 mock 合约并调用
      const { mockDailyCheckIn } = await import('@/lib/mock/contracts');
      await mockDailyCheckIn.checkIn(content, onChainData);

      console.log('✅ 打卡成功！链上数据已保存:', onChainData);

      setIsSubmitting(false);
      setUploadProgress('');
      setShowRedPacket(true);
    } catch (error) {
      console.error('❌ 提交失败:', error);
      alert('提交失败，请重试');
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  const handleClaimRedPacket = () => {
    // TODO: 调用智能合约领取红包
    alert('红包已领取！');
    window.location.href = '/daily-checkin/calendar';
  };

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="w-full px-6 py-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex items-center gap-4">
          <Link
            href="/daily-checkin/calendar"
            className="flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-300"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-2xl font-bold">今日打卡任务</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          {/* 任务说明 */}
          <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                description
              </span>
              任务类型：发布旅游攻略
            </h2>
            <p className="text-gray-400 mb-4">
              分享你的旅行经验、景点推荐或旅游攻略，至少200字。
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">
                  schedule
                </span>
                <span className="text-gray-400">截止时间: 今日 23:59</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">
                  paid
                </span>
                <span className="text-gray-400">奖励: 随机红包 5-50 代币</span>
              </div>
            </div>
          </div>

          {/* 内容编辑器 */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                攻略内容
              </label>
              <span
                className={`text-sm font-bold ${
                  isValid ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {currentWords} / {minWords} 字
              </span>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享你的旅行故事...&#10;&#10;例如：&#10;- 景点推荐和亮点&#10;- 旅行路线和时间安排&#10;- 美食和住宿建议&#10;- 实用小贴士"
              className="w-full h-80 bg-black/30 border border-white/20 rounded-xl px-4 py-4 text-white resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />

            {!isValid && currentWords > 0 && (
              <p className="text-sm text-yellow-500">
                还需要 {minWords - currentWords} 字才能提交
              </p>
            )}
          </div>

          {/* 图片上传 */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">
                  image
                </span>
                上传图片 (可选)
              </label>
              {selectedImage && (
                <span className="text-xs text-gray-400">
                  {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                </span>
              )}
            </div>

            <ImageUpload
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              preview={imagePreview}
            />

            <p className="text-xs text-gray-400">
              💡 添加图片可以让你的攻略更加生动，图片将被上传到 IPFS 去中心化存储
            </p>
          </div>

          {/* 提交按钮 */}
          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
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

            {/* 上传进度提示 */}
            {uploadProgress && (
              <div className="flex items-center justify-center gap-2 text-sm text-primary animate-pulse">
                <span className="material-symbols-outlined text-base animate-spin">
                  sync
                </span>
                <span>{uploadProgress}</span>
              </div>
            )}
          </div>

          {/* 说明文字 */}
          <div className="glass-panel p-4 rounded-xl">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">
                info
              </span>
              注意事项
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>内容需原创，禁止抄袭</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>图片和文字将上传到 IPFS 去中心化存储</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>链上只存储 IPFS hash，节省 Gas 费用</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>提交后不可修改，请仔细检查</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>红包将在提交成功后立即发放</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>每天只能完成一次打卡任务</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* 红包弹窗 */}
      {showRedPacket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-panel p-8 rounded-2xl max-w-md w-full mx-4 space-y-6 animate-in fade-in zoom-in duration-300">
            {/* 红包图标 */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="size-32 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center animate-pulse">
                  <span className="text-6xl">🧧</span>
                </div>
                <div className="absolute -top-2 -right-2 size-8 rounded-full bg-primary flex items-center justify-center animate-bounce">
                  <span className="material-symbols-outlined text-background-dark text-sm">
                    check
                  </span>
                </div>
              </div>
            </div>

            {/* 标题 */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">打卡成功！</h3>
              <p className="text-gray-400">恭喜你获得今日红包奖励</p>
            </div>

            {/* 红包金额 */}
            <div className="glass-panel p-6 rounded-xl text-center space-y-2">
              <p className="text-sm text-gray-400">红包金额</p>
              <p className="text-4xl font-bold text-primary">
                {Math.floor(Math.random() * 46) + 5}
                <span className="text-xl ml-2">代币</span>
              </p>
            </div>

            {/* 按钮 */}
            <div className="space-y-3">
              <button
                onClick={handleClaimRedPacket}
                className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-background-dark px-6 py-4 rounded-full font-bold text-base tracking-wide transition-all duration-300 hover:scale-105"
              >
                <span className="material-symbols-outlined">redeem</span>
                <span>领取红包</span>
              </button>
              <button
                onClick={() => setShowRedPacket(false)}
                className="w-full glass-panel py-3 rounded-full hover:border-primary transition-all text-sm font-medium"
              >
                稍后领取
              </button>
            </div>

            {/* 提示 */}
            <p className="text-xs text-center text-gray-500">
              红包将在24小时后过期，请及时领取
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
