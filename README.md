# 🎨 AI 換髮型 App 後端

這是一個為 AI 換髮型 App 設計的 Firebase Cloud Functions 後端專案，提供點數管理、髮型生成和內購驗證功能。

## 📋 專案概述

這個後端服務為 React Native (Expo) 前端 App 提供支援，主要功能包括：

- **點數管理系統**：管理用戶的髮型生成點數
- **髮型生成服務**：`tryHairstyle` Cloud Function（目前為 MVP 版本，返回模擬圖片）
- **安全的 Firestore 規則**：防止客戶端直接操作點數
- **內購驗證框架**：為 iOS/Android 內購準備的骨架代碼

## 🏗️ 技術架構

- **Firebase Cloud Functions** - 無伺服器後端邏輯
- **Firestore** - NoSQL 數據庫
- **Firebase Authentication** - 用戶認證
- **TypeScript** - 型別安全的開發體驗
- **Node.js 18+** - 運行環境

## 📁 專案結構

```
hairstyle-stylist-server/
├── functions/                    # Cloud Functions 代碼
│   ├── src/
│   │   └── index.ts             # 主要 Functions：tryHairstyle + IAP skeleton
│   ├── package.json             # Functions 依賴項
│   ├── tsconfig.json            # TypeScript 配置
│   └── .eslintrc.js            # ESLint 配置
├── firestore.rules              # Firestore 安全規則
├── firestore.indexes.json       # Firestore 索引配置
├── firebase.json                # Firebase 專案配置
└── README.md                    # 專案說明文檔
```

## 🚀 快速開始

### 1. 環境準備

```bash
# 安裝 Firebase CLI（如果還沒安裝）
npm install -g firebase-tools

# 登入 Firebase
firebase login
```

### 2. 安裝依賴

```bash
# 進入 functions 目錄
cd functions

# 安裝 Node.js 依賴
npm install
```

### 3. 本地開發

```bash
# 啟動 Firebase Emulator（包含 Functions、Firestore、Auth）
npm run serve

# 或者直接使用 Firebase CLI
firebase emulators:start
```

Emulator 啟動後可以在以下地址訪問：
- **Emulator UI**: http://localhost:4000
- **Functions**: http://localhost:5001
- **Firestore**: http://localhost:8080
- **Auth**: http://localhost:9099

### 4. 編譯和檢查

```bash
# 編譯 TypeScript
npm run build

# 檢查代碼風格
npm run lint

# 自動修復 lint 問題
npm run lint:fix
```

## 🔧 部署到 Firebase

### 1. 初始化 Firebase 專案

```bash
# 在專案根目錄執行
firebase init

# 選擇以下選項：
# - Functions: Configure and deploy Cloud Functions
# - Firestore: Deploy rules and create indexes
```

### 2. 設定 Firebase 專案

```bash
# 設定要部署的 Firebase 專案
firebase use --add

# 選擇你的 Firebase 專案 ID
```

### 3. 部署

```bash
# 僅部署 Cloud Functions
firebase deploy --only functions

# 僅部署 Firestore 規則
firebase deploy --only firestore:rules

# 完整部署（Functions + Firestore）
firebase deploy
```

## 📱 API 使用說明

### `tryHairstyle` Cloud Function

**功能**: 用戶嘗試 AI 換髮型功能

**認證**: 需要 Firebase Auth 登入

**流程**:
1. 驗證用戶已登入
2. 檢查用戶點數（至少需要 1 點）
3. 使用 Firestore Transaction 安全扣除 1 點
4. 返回模擬髮型圖片 URL 和剩餘點數

**調用方式**:
```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const tryHairstyle = httpsCallable(functions, 'tryHairstyle');

// 調用函數
const result = await tryHairstyle();

console.log('生成圖片:', result.data.imageUrl);
console.log('剩餘點數:', result.data.creditsLeft);
```

**回應格式**:
```json
{
  "success": true,
  "imageUrl": "https://mock-hairstyle-generator.com/generated/...",
  "creditsLeft": 4
}
```

### 用戶數據結構

```typescript
interface UserData {
  credits: number;           // 用戶點數
  email?: string;           // 用戶郵箱
  displayName?: string;     // 顯示名稱
  createdAt?: Timestamp;    // 創建時間
  lastUsed?: Timestamp;     // 最後使用時間
}
```

## 🔒 安全規則說明

### Firestore Security Rules

- **用戶文檔** (`/users/{userId}`)：
  - ✅ 用戶只能讀取自己的文檔
  - ❌ 禁止客戶端直接寫入（必須通過 Cloud Functions）
  
- **購買記錄** (`/purchases/{purchaseId}`)：
  - ✅ 用戶可以查看自己的購買歷史
  - ❌ 只有 Cloud Functions 可以創建購買記錄
  - ❌ 購買記錄不可修改（審計追蹤）

- **管理員** (`/admin/{document}`)：
  - 🔄 預留給未來管理員功能
  - 需要管理員權限令牌

## 🛍️ 內購功能（TODO）

專案已為內購驗證準備了骨架代碼：

### `verifyIosPurchase` (未實現)
- iOS App Store 購買驗證
- 需要實現 App Store Connect API 集成

### `verifyAndroidPurchase` (未實現)  
- Google Play Store 購買驗證
- 需要實現 Google Play Console API 集成

### 實現計劃
1. 驗證購買收據的真實性
2. 檢查購買是否已經處理過
3. 為用戶帳戶添加對應點數
4. 記錄購買記錄用於審計

## 🧪 測試

### 本地測試用戶流程

1. 啟動 Emulator: `npm run serve`
2. 在 Auth Emulator 中創建測試用戶
3. 使用測試用戶調用 `tryHairstyle` 函數
4. 查看 Firestore Emulator 中的用戶數據變化

### 模擬數據

- 新用戶自動獲得 5 個免費點數
- 每次調用 `tryHairstyle` 消耗 1 點數
- 返回隨機髮型模擬圖片 URL

## 🔮 未來功能

- [ ] 集成 Google Gemini API 進行真實 AI 髮型生成
- [ ] 實現 iOS/Android 內購驗證
- [ ] 添加管理員後台功能
- [ ] 實現點數套餐和定價策略
- [ ] 添加用戶使用分析和統計
- [ ] 實現髮型歷史記錄功能

## 🐛 問題排除

### 常見問題

**Q: Cloud Functions 部署失敗**
A: 檢查 Node.js 版本是否為 18+，確保 `npm run build` 無錯誤

**Q: Firestore 規則測試失敗**
A: 使用 Firebase Emulator 測試規則，確保用戶已正確登入

**Q: 用戶點數顯示錯誤**
A: 檢查 Firestore 安全規則，確保前端沒有直接修改點數

### 調試技巧

```bash
# 查看 Functions 日誌
firebase functions:log

# 查看特定函數日誌
firebase functions:log --only tryHairstyle

# 本地調試
firebase functions:shell
```

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來改進這個專案！

## 📄 授權

此專案採用 MIT 授權條款。