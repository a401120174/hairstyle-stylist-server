# 🎨 tryHairstyle 函數使用說明

## 函數功能
`tryHairstyle` 函數可以接收用戶照片和指定的髮型key，使用 Gemini API 進行 AI 髮型變換。

## API 參數

### 輸入參數 (TryHairstyleRequest)
```typescript
interface TryHairstyleRequest {
  userPhoto: string;    // Base64 編碼的用戶照片
  hairstyleKey: string; // 髮型模板的 key
}
```

### 回傳結果 (TryHairstyleResponse)
```typescript
interface TryHairstyleResponse {
  success: boolean;     // 是否成功
  imageUrl?: string;    // 生成的圖片 URL
  creditsLeft?: number; // 剩餘點數
  error?: string;       // 錯誤訊息
}
```

## 前端調用範例

### JavaScript/TypeScript
```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const tryHairstyle = httpsCallable(functions, 'tryHairstyle');

// 準備用戶照片 (Base64 格式)
const userPhotoBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...";

// 調用函數
try {
  const result = await tryHairstyle({
    userPhoto: userPhotoBase64,
    hairstyleKey: "short-bob"
  });
  
  if (result.data.success) {
    console.log('生成成功！');
    console.log('圖片 URL:', result.data.imageUrl);
    console.log('剩餘點數:', result.data.creditsLeft);
  } else {
    console.error('生成失敗:', result.data.error);
  }
} catch (error) {
  console.error('調用失敗:', error);
}
```

### 將檔案轉換為 Base64
```javascript
// 從檔案輸入元素獲取圖片
function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 使用範例
const fileInput = document.getElementById('photo-input');
const file = fileInput.files[0];
const base64Image = await convertImageToBase64(file);
```

## 支援的髮型 Keys

目前支援的髮型模板 keys：
- `classic-pompadour` - 經典龐巴度髮型
- `fade-buzz-cut` - 漸層平頭
- `messy-short-curls` - 凌亂短捲髮
- `short-bob` - 短髮波波頭

### 呼叫範例
```javascript
// 使用經典龐巴度髮型
const result = await tryHairstyle({
  userPhoto: userPhotoBase64,
  hairstyleKey: "classic-pompadour"
});

// 使用漸層平頭
const result = await tryHairstyle({
  userPhoto: userPhotoBase64,
  hairstyleKey: "fade-buzz-cut"
});
```

## 錯誤處理

### 常見錯誤
1. **unauthenticated**: 用戶未登入
2. **invalid-argument**: 參數無效（缺少 userPhoto 或 hairstyleKey）
3. **failed-precondition**: 點數不足
4. **internal**: 服務器內部錯誤

### 錯誤處理範例
```javascript
try {
  const result = await tryHairstyle(data);
} catch (error) {
  switch (error.code) {
    case 'unauthenticated':
      // 導向登入頁面
      break;
    case 'failed-precondition':
      // 提示購買點數
      break;
    case 'invalid-argument':
      // 檢查輸入參數
      break;
    default:
      // 其他錯誤處理
      break;
  }
}
```

## 環境設定

### 1. 設定 Gemini API Key
在 Firebase Functions 中設定環境變數：
```bash
firebase functions:config:set gemini.api_key="your_gemini_api_key_here"
```

或在本地開發時使用 `.env.local` 檔案：
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. 添加髮型模板圖片
將髮型模板圖片放入 `functions/hair/` 目錄：
```
functions/hair/
├── short-bob.jpg
├── long-curly.jpg
├── pixie-cut.jpg
└── ...
```

## 注意事項

1. **圖片格式**: 支援 JPG, PNG 格式
2. **圖片大小**: 建議用戶照片不超過 5MB
3. **Base64 編碼**: 確保包含完整的 data URL 前綴
4. **點數扣除**: 每次成功調用扣除 1 點數
5. **API 限制**: Gemini API 有調用頻率限制

## 部署

```bash
# 構建和部署
cd functions
npm run build
firebase deploy --only functions
```