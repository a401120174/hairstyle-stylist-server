# Hairstyle Stylist Server

一個使用 TypeScript 和 Express 建立的髮型造型師伺服器 API。

## 功能特色

- ✅ TypeScript 支援，提供型別安全
- ✅ Express.js 框架
- ✅ 安全性中間件 (Helmet)
- ✅ CORS 支援
- ✅ 請求日誌記錄 (Morgan)
- ✅ 環境變數配置 (dotenv)
- ✅ 開發時自動重啟 (nodemon)
- ✅ 模組化路由結構

## 專案結構

```
src/
├── app.ts              # 主應用程式檔案
├── controllers/        # 控制器
│   ├── healthController.ts
│   └── hairstyleController.ts
├── routes/            # 路由定義
│   ├── api.ts
│   └── hairstyle.ts
├── services/          # 服務層
│   └── aiService.ts   # Google GenAI 整合
├── middleware/        # 自定義中間件
├── models/           # 資料模型
├── utils/            # 工具函數
├── config/           # 配置檔案
└── types/            # TypeScript 型別定義
    └── index.ts
```

## 安裝與執行

### 1. 安裝依賴套件
```bash
npm install
```

### 2. 設定環境變數
複製 `.env` 檔案並設定必要的環境變數：
```bash
PORT=3000
NODE_ENV=development
GOOGLE_API_KEY=your-google-api-key-here
```

**重要：** 您需要從 [Google AI Studio](https://aistudio.google.com/app/apikey) 取得 Google API 金鑰。

### 3. 開發模式
```bash
npm run dev
```

### 4. 建置專案
```bash
npm run build
```

### 5. 生產模式
```bash
npm start
```

## API 端點

### 基本端點
- `GET /` - 歡迎訊息
- `GET /api/health` - 健康檢查

### 髮型 AI 端點
- `GET /api/hairstyle/prompts` - 取得預設髮型提示範本
- `POST /api/hairstyle/generate` - 使用 AI 生成新髮型

### 健康檢查範例回應
```json
{
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2025-09-13T10:30:00.000Z"
}
```

### 髮型生成範例
```json
{
  "userImage": {
    "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "mimeType": "image/jpeg"
  },
  "hairstylePrompt": "Change this person's hairstyle to a modern short bob cut"
}
```

詳細的 API 使用說明請參考 [API_GUIDE.md](./API_GUIDE.md)。

## 開發指令

- `npm run dev` - 啟動開發伺服器 (使用 nodemon 和 ts-node)
- `npm run build` - 編譯 TypeScript 到 dist/ 資料夾
- `npm run build:watch` - 監聽模式編譯
- `npm start` - 執行編譯後的 JavaScript
- `npm run clean` - 清除編譯輸出

## 技術堆疊

- **Runtime**: Node.js
- **語言**: TypeScript
- **框架**: Express.js
- **AI 服務**: Google Gemini AI (2.5 Flash)
- **安全性**: Helmet
- **CORS**: cors
- **日誌**: Morgan
- **環境配置**: dotenv
- **開發工具**: nodemon, ts-node

## 接下來的開發

您可以繼續添加以下功能：
- 資料庫整合 (MongoDB, PostgreSQL 等)
- 身份驗證與授權 (JWT)
- API 文件 (Swagger)
- 單元測試 (Jest)
- 錯誤處理中間件
- 資料驗證 (Joi, express-validator)
- 檔案上傳處理
- 快取機制 (Redis)
