# 🎨 Firebase Hosting - 靜態圖片管理

這個目錄用於管理髮型設計應用程式的所有靜態圖片資源。

## 📁 目錄結構

```
public/
├── index.html              # 主頁面
├── images/                 # 主要圖片目錄
│   ├── hairstyles/        # 髮型範例圖片
│   ├── icons/             # 應用程式圖示
│   └── generated/         # AI 生成的髮型圖片
└── README.md              # 這個檔案
```

## 🚀 部署指令

```bash
# 部署到 Firebase Hosting
firebase deploy --only hosting

# 僅部署特定檔案
firebase deploy --only hosting:your-site-name
```

## 📸 圖片使用方式

### 1. 上傳圖片
將圖片檔案直接放入對應的目錄中：
- 髮型範例：`public/images/hairstyles/`
- 應用程式圖示：`public/images/icons/`
- AI 生成圖片：`public/images/generated/`

### 2. 訪問圖片
部署後，圖片可以通過以下 URL 訪問：
```
https://your-project-id.web.app/images/hairstyles/example.jpg
https://your-project-id.web.app/images/icons/app-icon.png
https://your-project-id.web.app/images/generated/user123-style456.jpg
```

### 3. 在應用程式中使用
```javascript
// 在您的應用程式中引用圖片
const imageUrl = "https://your-project-id.web.app/images/hairstyles/bob-cut.jpg";
```

## 🔧 最佳實踐

### 圖片格式建議
- **JPEG**: 照片和複雜圖像
- **PNG**: 透明背景圖片和圖示
- **WebP**: 現代瀏覽器的最佳選擇

### 檔案命名規範
- 使用小寫字母和連字符
- 包含描述性名稱
- 範例：`short-bob-blonde.jpg`, `app-icon-192.png`

### 圖片優化
- 壓縮圖片以減少檔案大小
- 使用適當的解析度
- 考慮使用 CDN 快取

## 🔒 安全設定

Firebase Hosting 預設允許公開訪問所有檔案。如果需要限制訪問，可以：
1. 使用 Firebase Storage 進行更細緻的權限控制
2. 實施 Firebase Security Rules
3. 使用 Cloud Functions 進行動態權限檢查

## 📊 監控和分析

可以在 Firebase Console 中查看：
- 網站流量統計
- 圖片下載次數
- 頻寬使用情況
- 錯誤日誌

## 🛠️ 故障排除

### 常見問題
1. **404 錯誤**: 檢查檔案路徑和檔名
2. **緩存問題**: 使用版本號或查詢參數
3. **大檔案載入慢**: 優化圖片大小和格式

### 除錯指令
```bash
# 本地測試
firebase serve --only hosting

# 檢查部署狀態
firebase hosting:sites:list
```