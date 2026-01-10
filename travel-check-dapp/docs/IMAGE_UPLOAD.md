# 打卡图片上传功能

## 功能概述

打卡功能支持上传图片，图片和文字内容将通过 IPFS 去中心化存储，链上只存储 IPFS hash，节省 Gas 费用。

## 数据流程

```
用户输入文字 + 选择图片
         ↓
1. 压缩图片 (最大宽度 1200px, JPEG 85% 质量)
         ↓
2. 上传图片到 IPFS → 获得图片 Hash
         ↓
3. 组合打卡数据 (文字 + 图片Hash + 时间戳)
         ↓
4. 上传打卡数据到 IPFS → 获得数据 Hash
         ↓
5. 准备链上数据 (ipfs://{dataHash})
         ↓
6. 调用智能合约 checkIn(content, dataHash)
         ↓
7. 链上存储 IPFS hash，实际数据在 IPFS
```

## 数据结构

### CheckInData (存储在 IPFS)

```typescript
interface CheckInData {
  text: string;           // 打卡文字内容
  imageHash?: string;     // 图片的 IPFS hash (可选)
  timestamp: number;      // 打卡时间戳
  location?: {            // 位置信息 (可选)
    lat: number;
    lng: number;
  };
}
```

### CheckInRecord (链上记录)

```solidity
struct CheckInRecord {
    uint256 timestamp;      // 打卡时间
    string content;         // 文字内容 (或简短描述)
    string dataHash;        // IPFS hash (ipfs://Qm...)
    uint256 redPacket;      // 红包金额
}
```

## IPFS 集成

### 当前实现（开发环境）

- 使用 localStorage 模拟 IPFS 存储
- 生成模拟的 IPFS hash
- 图片压缩后转换为 base64 存储

### 生产环境建议

推荐使用以下 IPFS 服务之一：

1. **Pinata** (https://pinata.cloud)
   - 简单易用的 API
   - 提供免费额度
   - 良好的性能

2. **NFT.Storage** (https://nft.storage)
   - 免费存储
   - 专为 NFT 数据优化
   - Filecoin 支持

3. **Web3.Storage** (https://web3.storage)
   - 免费存储
   - 简单的 API
   - IPFS + Filecoin

### 集成示例 (Pinata)

```typescript
import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

export async function uploadImageToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    }
  );

  return response.data.IpfsHash;
}

export async function uploadCheckInDataToIPFS(data: CheckInData): Promise<string> {
  const response = await axios.post(
    'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    }
  );

  return response.data.IpfsHash;
}
```

## 图片上传组件

### ImageUpload 组件特性

- ✅ 拖拽上传支持
- ✅ 点击上传
- ✅ 图片预览
- ✅ 文件大小验证 (最大 10MB)
- ✅ 文件类型验证 (只允许图片)
- ✅ 图片压缩 (最大宽度 1200px)

### 使用示例

```tsx
import ImageUpload from '@/components/checkin/image-upload';

function CheckInForm() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    // 创建预览...
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  return (
    <ImageUpload
      onImageSelect={handleImageSelect}
      onImageRemove={handleImageRemove}
      preview={imagePreview}
    />
  );
}
```

## 智能合约接口

### checkIn 函数

```solidity
function checkIn(string memory content, string memory dataHash) external {
    require(stakes[msg.sender].amount > 0, "No active stake");

    // 更新质押信息
    stakes[msg.sender].currentDay += 1;
    stakes[msg.sender].lastCheckInTime = block.timestamp;

    // 保存打卡记录
    checkInRecords[msg.sender].push(CheckInRecord({
        timestamp: block.timestamp,
        content: content,
        dataHash: dataHash,  // ipfs://Qm...
        redPacket: _calculateRedPacket()
    }));

    emit CheckedIn(msg.sender, dataHash, block.timestamp);
}
```

## Gas 优化

通过使用 IPFS 存储数据，可以显著降低 Gas 费用：

| 存储方式 | 数据量 | 预估 Gas |
|---------|--------|---------|
| 链上存储 200 字文字 | ~200 bytes | ~40,000 gas |
| 链上存储图片 (100KB) | ~100,000 bytes | ~20,000,000 gas |
| **IPFS hash (46 bytes)** | **46 bytes** | **~10,000 gas** |

**节省比例：** 使用 IPFS 可以节省 99% 以上的存储 Gas 费用！

## 获取打卡数据

```typescript
import { getIPFSCheckInData, getIPFSImageUrl } from '@/lib/utils/ipfs';

// 从智能合约获取记录
const record = await contract.getCheckInRecord(address, index);

// 从 IPFS 获取完整数据
const dataHash = record.dataHash.replace('ipfs://', '');
const checkInData = getIPFSCheckInData(dataHash);

// 获取图片 URL
if (checkInData.imageHash) {
  const imageUrl = getIPFSImageUrl(checkInData.imageHash);
  console.log('图片:', imageUrl);
}

console.log('文字:', checkInData.text);
console.log('时间:', new Date(checkInData.timestamp));
```

## 注意事项

1. **图片大小限制：** 最大 10MB，建议压缩后上传
2. **IPFS 持久化：** 需要使用 Pinning 服务确保数据长期存储
3. **链上存储：** 只存储 IPFS hash，不存储实际数据
4. **Gas 费用：** IPFS 方案可节省 99% 以上的 Gas
5. **数据可用性：** 使用多个 IPFS gateway 确保数据可访问

## 相关文件

- `/lib/utils/ipfs.ts` - IPFS 工具函数
- `/components/checkin/image-upload.tsx` - 图片上传组件
- `/app/daily-checkin/task/page.tsx` - 打卡任务页面
- `/lib/mock/contracts.ts` - Mock 合约接口
- `/contracts/DailyCheckIn.sol` - 智能合约
