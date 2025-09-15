# 🎨 AI 換髮型 App - API 文檔

這份文檔詳細介紹了 AI 換髮型 App 後端提供的所有 API 端點。

## 📋 目錄

- [環境配置](#環境配置)
- [API 概覽](#api-概覽)
- [認證方式](#認證方式)
- [核心 API](#核心-api)
  - [getUserCredits - 獲取用戶點數](#getuserCredits---獲取用戶點數)
  - [tryHairstyle - 嘗試髮型](#tryhairstyle---嘗試髮型)
  - [getHairstyleTemplates - 獲取髮型模板列表](#gethairstyletemplates---獲取髮型模板列表)
- [內購相關 API](#內購相關-api)
  - [verifyIosPurchase - iOS 內購驗證](#verifyiospurchase---ios-內購驗證)
  - [verifyAndroidPurchase - Android 內購驗證](#verifyandroidpurchase---android-內購驗證)
- [管理員 API](#管理員-api)
  - [uploadHairstyleTemplate - 上傳髮型模板](#uploadhairstyletemplate---上傳髮型模板)
  - [addCreditsToUser - 管理員加點](#addcreditstouser---管理員加點)
- [錯誤處理](#錯誤處理)

## 🛠️ 環境配置

### 開發環境
- **Base URL**: `http://127.0.0.1:5001/hairstyle-stylish/us-central1`
- **Firebase Auth**: `http://127.0.0.1:9099`
- **Firestore**: `http://127.0.0.1:8080`
- **管理界面**: `http://127.0.0.1:4000`

### 生產環境
- **Base URL**: `https://us-central1-hairstyle-stylish.cloudfunctions.net`
- **Region**: `us-central1`

## 📊 API 概覽

| API 名稱 | 功能 | 狀態 | 需要認證 |
|---------|------|------|----------|
| `getUserCredits` | 獲取用戶點數和基本信息 | ✅ 可用 | 是 |
| `tryHairstyle` | 嘗試 AI 換髮型功能 | ✅ 可用 | 是 |
| `getHairstyleTemplates` | 獲取可用髮型模板列表 | ✅ 可用 | 否 |
| `verifyIosPurchase` | iOS 內購驗證 | 🚧 開發中 | 是 |
| `verifyAndroidPurchase` | Android 內購驗證 | 🚧 開發中 | 是 |
| `uploadHairstyleTemplate` | 上傳髮型模板（管理員） | ✅ 可用 | 是 |
| `addCreditsToUser` | 管理員手動加點 | 🚧 開發中 | 是 |

## 🔐 認證方式

大部分 API 都需要用戶通過 Firebase Authentication 登入。在前端調用時，Firebase SDK 會自動處理認證令牌。

## 🎯 核心 API

### `getUserCredits` - 獲取用戶點數

獲取用戶當前的點數餘額和基本資料。

#### 📝 功能描述
- 檢查用戶當前點數餘額
- 返回用戶基本信息（email、顯示名稱等）
- 如果是新用戶，自動創建帳戶並給予 5 個免費點數
- 更新用戶最後活動時間

#### 📤 請求參數
無需參數

#### 📥 回應格式
```typescript
interface GetUserCreditsResponse {
  success: boolean;
  credits?: number;
  userInfo?: {
    email?: string;
    displayName?: string;
    createdAt?: string;
    lastUsed?: string;
  };
  error?: string;
}
```

---

### `tryHairstyle` - 嘗試髮型

使用 AI 生成新的髮型圖片，需要消耗 1 個點數。

#### 📝 功能描述
- 驗證用戶是否有足夠點數（至少 1 點）
- 使用 Firestore Transaction 安全扣除 1 點
- 接收用戶照片和髮型選擇，使用 Gemini AI 生成新髮型圖片
- 返回生成的髮型圖片 URL 和剩餘點數

#### 📤 請求參數
```typescript
interface TryHairstyleRequest {
  userPhoto: string;     // Base64 編碼的用戶照片
  hairstyleKey: string;  // 髮型模板鍵值
}
```

**支援的髮型鍵值:**
- `classic-pompadour` - 經典龐畢度
- `fade-buzz-cut` - 漸層寸頭
- `messy-short-curls` - 凌亂短捲髮
- `short-bob` - 短鮑伯頭

#### 📥 回應格式
```typescript
interface TryHairstyleResponse {
  success: boolean;
  imageUrl?: string;     // 生成的髮型圖片 URL
  creditsLeft?: number;  // 剩餘點數
  error?: string;
}
```

---

### `getHairstyleTemplates` - 獲取髮型模板列表

獲取所有可用的髮型模板信息。

#### 📝 功能描述
- 返回所有支援的髮型模板列表
- 包含髮型鍵值、顯示名稱和可用狀態
- 不需要用戶認證

#### 📤 請求參數
無需參數

#### 📥 回應格式
```typescript
interface GetHairstyleTemplatesResponse {
  success: boolean;
  hairstyles?: HairstyleTemplate[];
  error?: string;
}

interface HairstyleTemplate {
  key: string;        // 髮型鍵值
  name: string;       // 顯示名稱
  available: boolean; // 是否可用
}
```

## 💳 內購相關 API

### `verifyIosPurchase` - iOS 內購驗證

**狀態**: 🚧 開發中

驗證 iOS App Store 內購收據並為用戶帳戶添加點數。

#### 📤 請求參數
```typescript
interface VerifyPurchaseRequest {
  receiptData?: string;  // iOS App Store 收據數據
  productId?: string;    // 產品 ID
}
```

#### 📥 回應格式
```typescript
interface VerifyPurchaseResponse {
  success: boolean;
  creditsAdded?: number; // 添加的點數
  error?: string;
  message?: string;
}
```

---

### `verifyAndroidPurchase` - Android 內購驗證

**狀態**: 🚧 開發中

驗證 Google Play Store 內購並為用戶帳戶添加點數。

#### 📤 請求參數
```typescript
interface VerifyPurchaseRequest {
  purchaseToken?: string; // Google Play 購買令牌
  productId?: string;     // 產品 ID
  packageName?: string;   // 應用包名
}
```

#### 📥 回應格式
```typescript
interface VerifyPurchaseResponse {
  success: boolean;
  creditsAdded?: number; // 添加的點數
  error?: string;
  message?: string;
}
```

## 👨‍💼 管理員 API

### `uploadHairstyleTemplate` - 上傳髮型模板

**狀態**: ✅ 可用

允許管理員上傳新的髮型模板到 Firebase Storage。

#### 📝 功能描述
- 上傳髮型模板圖片到 Firebase Storage
- 設定圖片為公開可訪問
- 返回上傳後的檔案路徑和公開 URL

#### 📤 請求參數
```typescript
interface UploadHairstyleTemplateRequest {
  hairstyleKey: string;  // 髮型鍵值
  imageBase64: string;   // Base64 編碼的圖片數據
  fileName: string;      // 檔案名稱
}
```

#### 📥 回應格式
```typescript
interface UploadHairstyleTemplateResponse {
  success: boolean;
  message?: string;      // 成功訊息
  filePath?: string;     // Storage 中的檔案路徑
  publicUrl?: string;    // 公開訪問 URL
  error?: string;
}
```

---

### `addCreditsToUser` - 管理員加點

**狀態**: 🚧 開發中

允許管理員手動為指定用戶添加點數（用於客戶服務或測試）。

#### 📤 請求參數
```typescript
interface AddCreditsToUserRequest {
  userId: string;   // 目標用戶 ID
  credits: number;  // 要添加的點數
}
```

#### 📥 回應格式
```typescript
interface AddCreditsToUserResponse {
  success: boolean;
  creditsAdded?: number; // 實際添加的點數
  newTotal?: number;     // 用戶新的總點數
  error?: string;
  message?: string;
}
```

## ⚠️ 錯誤處理

### 常見錯誤代碼

| 錯誤代碼 | 描述 | 解決方案 |
|---------|------|----------|
| `functions/unauthenticated` | 用戶未登入 | 引導用戶登入 |
| `functions/invalid-argument` | 請求參數無效 | 檢查參數格式和必填欄位 |
| `functions/failed-precondition` | 前置條件失敗（如點數不足） | 根據具體情況處理 |
| `functions/permission-denied` | 權限不足 | 檢查用戶權限或管理員身份 |
| `functions/internal` | 服務器內部錯誤 | 稍後重試或聯絡客服 |

### API 回應狀態

所有 API 都會返回包含 `success` 欄位的回應：
- `success: true` - 操作成功
- `success: false` - 操作失敗，查看 `error` 或 `message` 欄位了解原因

### 錯誤處理範例

```typescript
try {
  const result = await apiFunction(params);
  if (result.data.success) {
    // 處理成功情況
    console.log('操作成功');
  } else {
    // 處理業務邏輯錯誤
    console.error('操作失敗:', result.data.error || result.data.message);
  }
} catch (error) {
  // 處理網路或權限錯誤
  switch (error.code) {
    case 'functions/unauthenticated':
      console.error('用戶未登入');
      break;
    case 'functions/failed-precondition':
      console.error('條件不滿足（如點數不足）');
      break;
    case 'functions/invalid-argument':
      console.error('參數錯誤');
      break;
    default:
      console.error('未知錯誤:', error.message);
  }
}
```

## 📝 使用注意事項

1. **認證要求**: 大部分 API 需要用戶登入，只有 `getHairstyleTemplates` 可以匿名訪問
2. **點數系統**: 每次使用 `tryHairstyle` 會消耗 1 個點數，新用戶獲得 5 個免費點數
3. **圖片格式**: 上傳的圖片需要是 Base64 編碼格式
4. **檔案大小**: 建議上傳的圖片不超過 10MB
5. **髮型模板**: 目前支援 4 種髮型模板，可透過 `getHairstyleTemplates` 獲取最新列表