# 🔄 Firebase Storage 髮型模板管理

現在髮型模板圖片已經改為從 Firebase Storage 讀取，這提供了更好的靈活性和可管理性。

## 📁 新的架構

### 髮型模板圖片位置
- **之前**：`functions/hair/` 本地目錄
- **現在**：Firebase Storage 的 `hairstyles/` 目錄

### 路徑對應
```
Firebase Storage:
├── hairstyles/
│   ├── classic-pompadour.png
│   ├── fade-buzz-cut.png
│   ├── messy-short-curls.png
│   └── short-bob.jpg
└── generated/
    └── {userId}/
        └── {hairstyleKey}-{timestamp}.jpg
```

## 🚀 上傳髮型模板

### 方法 1: 使用上傳腳本
```bash
# 在 functions 目錄下執行
node upload-hairstyles.js
```

### 方法 2: 使用 Cloud Function
```javascript
// 前端調用上傳函數
const uploadHairstyleTemplate = httpsCallable(functions, 'uploadHairstyleTemplate');

const result = await uploadHairstyleTemplate({
  hairstyleKey: "classic-pompadour",
  imageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  fileName: "classic-pompadour.png"
});
```

### 方法 3: 手動上傳到 Firebase Console
1. 前往 Firebase Console > Storage
2. 創建 `hairstyles` 資料夾
3. 上傳髮型圖片檔案

## 📋 新增的 Cloud Functions

### 1. `uploadHairstyleTemplate`
- **用途**：上傳新的髮型模板
- **權限**：需要認證用戶（可加入管理員驗證）
- **參數**：
  ```typescript
  {
    hairstyleKey: string;
    imageBase64: string;
    fileName: string;
  }
  ```

### 2. `getHairstyleTemplates`
- **用途**：獲取可用的髮型模板列表
- **權限**：公開存取
- **回傳**：
  ```typescript
  {
    success: boolean;
    hairstyles: Array<{
      key: string;
      name: string;
      available: boolean;
    }>;
  }
  ```

## 🔧 優勢

### 1. **動態管理**
- 可以透過 API 動態新增髮型模板
- 不需要重新部署 Functions

### 2. **擴展性**
- 容易添加新的髮型類型
- 支援大量髮型模板

### 3. **維護性**
- 集中管理所有圖片資源
- 可以透過 Firebase Console 直接管理

### 4. **效能**
- Firebase Storage 提供 CDN 加速
- 更好的圖片載入效能

## 📱 前端使用範例

### 獲取可用髮型
```javascript
const getHairstyleTemplates = httpsCallable(functions, 'getHairstyleTemplates');
const templates = await getHairstyleTemplates();

console.log('可用髮型:', templates.data.hairstyles);
```

### 使用髮型變換
```javascript
const tryHairstyle = httpsCallable(functions, 'tryHairstyle');

const result = await tryHairstyle({
  userPhoto: userPhotoBase64,
  hairstyleKey: "classic-pompadour" // 來自 getHairstyleTemplates 的 key
});
```

## 🔄 遷移步驟

1. ✅ 修改 `loadHairstyleImage` 函數使用 Firebase Storage
2. ✅ 新增 `uploadHairstyleTemplate` 函數
3. ✅ 新增 `getHairstyleTemplates` 函數
4. ⏳ 上傳現有髮型圖片到 Storage
5. ⏳ 部署更新的 Functions
6. ⏳ 測試髮型變換功能

## 🛠️ 故障排除

### 常見問題
1. **髮型圖片不存在**：確認圖片已上傳到 Storage
2. **權限問題**：確認 Storage 規則允許讀取
3. **檔案名稱不符**：檢查映射表中的檔案名稱

### 檢查指令
```bash
# 列出 Storage 中的髮型圖片
gsutil ls gs://your-bucket-name/hairstyles/

# 檢查特定檔案
gsutil ls gs://your-bucket-name/hairstyles/classic-pompadour.png
```