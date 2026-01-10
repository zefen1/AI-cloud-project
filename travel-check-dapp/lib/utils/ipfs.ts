/**
 * IPFS 上传工具
 * 用于将图片和数据上传到 IPFS（去中心化存储）
 */

export interface CheckInData {
  text: string;
  imageHash?: string;
  timestamp: number;
  location?: {
    lat: number;
    lng: number;
  };
}

/**
 * 将文件转换为 base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 压缩图片
 */
export async function compressImage(file: File, maxWidth: number = 1200): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 按比例缩放
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('压缩图片失败'));
            }
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 上传图片到 IPFS (模拟版本)
 * 在生产环境中，这里应该调用真实的 IPFS API
 * 例如: Pinata, NFT.Storage, Web3.Storage 等
 */
export async function uploadImageToIPFS(file: File): Promise<string> {
  try {
    // 压缩图片
    const compressedBlob = await compressImage(file);

    // 转换为 base64 (用于模拟，真实环境应上传到 IPFS)
    const base64 = await fileToBase64(new File([compressedBlob], file.name));

    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 生成模拟的 IPFS hash
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    // 在实际环境中，应该存储到 IPFS 并返回真实的 hash
    // 这里暂时存储到 localStorage 用于开发测试
    const storageKey = `ipfs_${mockHash}`;
    localStorage.setItem(storageKey, base64);

    console.log('✅ 图片上传成功 (模拟):', mockHash);
    return mockHash;
  } catch (error) {
    console.error('❌ 图片上传失败:', error);
    throw new Error('图片上传失败');
  }
}

/**
 * 上传打卡数据到 IPFS
 * 将文字和图片 hash 组合成 JSON，上传到 IPFS
 */
export async function uploadCheckInDataToIPFS(data: CheckInData): Promise<string> {
  try {
    // 转换为 JSON
    const jsonData = JSON.stringify(data);

    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 生成模拟的 IPFS hash
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    // 存储到 localStorage (模拟 IPFS)
    const storageKey = `ipfs_data_${mockHash}`;
    localStorage.setItem(storageKey, jsonData);

    console.log('✅ 打卡数据上传成功 (模拟):', mockHash);
    return mockHash;
  } catch (error) {
    console.error('❌ 打卡数据上传失败:', error);
    throw new Error('打卡数据上传失败');
  }
}

/**
 * 从 IPFS 获取图片 (模拟版本)
 */
export function getIPFSImageUrl(hash: string): string {
  // 在实际环境中，应该返回 IPFS gateway URL
  // 例如: `https://ipfs.io/ipfs/${hash}` 或 `https://gateway.pinata.cloud/ipfs/${hash}`

  // 这里从 localStorage 读取模拟数据
  const storageKey = `ipfs_${hash}`;
  const base64 = localStorage.getItem(storageKey);

  if (base64) {
    return base64;
  }

  // 返回默认占位图
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage%3C/text%3E%3C/svg%3E';
}

/**
 * 从 IPFS 获取打卡数据
 */
export function getIPFSCheckInData(hash: string): CheckInData | null {
  try {
    const storageKey = `ipfs_data_${hash}`;
    const jsonData = localStorage.getItem(storageKey);

    if (jsonData) {
      return JSON.parse(jsonData) as CheckInData;
    }

    return null;
  } catch (error) {
    console.error('❌ 获取打卡数据失败:', error);
    return null;
  }
}

/**
 * 准备提交到链上的打卡数据
 * 返回格式化后的字符串，可直接作为智能合约参数
 */
export function prepareOnChainData(dataHash: string): string {
  // 链上只需要存储 IPFS hash
  // 实际的文字和图片内容都在 IPFS 上
  return `ipfs://${dataHash}`;
}
