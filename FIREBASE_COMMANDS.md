# Firebase 常用操作指令

## 🚀 部署相關

### 部署 Functions
```bash
# 部署所有 Functions
firebase deploy --only functions

# 部署特定 Function
firebase deploy --only functions:functionName

# 部署並查看日誌
firebase deploy --only functions && firebase functions:log
```

### 部署 Firestore 規則
```bash
# 部署 Firestore 安全規則
firebase deploy --only firestore:rules

# 部署 Firestore 索引
firebase deploy --only firestore:indexes

# 部署 Firestore 規則和索引
firebase deploy --only firestore
```

### 部署 Storage
```bash
# 部署 Storage 規則
firebase deploy --only storage

# 部署所有服務
firebase deploy
```

## 🔧 開發環境

### 本地模擬器
```bash
# 啟動 Functions 模擬器
firebase emulators:start --only functions

# 啟動 Firestore 模擬器
firebase emulators:start --only firestore

# 啟動所有模擬器
firebase emulators:start

# 在背景執行模擬器
firebase emulators:start &
```

### Functions 開發
```bash
# 進入 functions 目錄
cd functions

# 安裝依賴
npm install

# 編譯 TypeScript
npm run build

# 監控並自動編譯
npm run build:watch

# 本地測試 Functions
npm run serve
```

## 📊 監控與日誌

### 查看 Functions 日誌
```bash
# 查看最新日誌
firebase functions:log

# 持續監控日誌
firebase functions:log --follow

# 查看特定 Function 日誌
firebase functions:log --only functionName

# 查看最近 N 行日誌
firebase functions:log --lines 50
```

### 查看 Functions 狀態
```bash
# 列出所有 Functions
firebase functions:list

# 查看 Function 詳細信息
firebase functions:describe functionName
```

## ⚙️ 配置管理

### 環境變數配置
```bash
# 設定配置變數
firebase functions:config:set gemini.api_key="YOUR_API_KEY"

# 查看所有配置
firebase functions:config:get

# 查看特定配置
firebase functions:config:get gemini

# 刪除配置
firebase functions:config:unset gemini.api_key

# 複製配置到本地（用於模擬器）
firebase functions:config:get > functions/.runtimeconfig.json
```

## 🗄️ Firestore 操作

### 資料庫管理
```bash
# 匯出資料
firebase firestore:export gs://your-bucket/exports

# 匯入資料
firebase firestore:import gs://your-bucket/exports

# 刪除集合中的所有文件
firebase firestore:delete --all-collections --yes
```

### 索引管理
```bash
# 生成索引配置文件
firebase firestore:indexes

# 部署索引
firebase deploy --only firestore:indexes
```

## 🔐 認證與專案管理

### 專案管理
```bash
# 列出所有專案
firebase projects:list

# 切換專案
firebase use project-id

# 查看目前專案
firebase use

# 添加專案別名
firebase use --add
```

### 登入/登出
```bash
# 登入 Firebase
firebase login

# 登出
firebase logout

# 查看目前用戶
firebase auth:whoami
```

## 📱 Storage 操作

### 文件管理
```bash
# 上傳文件到 Storage
gsutil cp local-file.png gs://your-project.appspot.com/path/

# 下載文件
gsutil cp gs://your-project.appspot.com/path/file.png ./

# 列出 Storage 中的文件
gsutil ls gs://your-project.appspot.com/

# 設定文件權限為公開
gsutil acl ch -u AllUsers:R gs://your-project.appspot.com/path/file.png
```

## 🛠️ 除錯與故障排除

### 常見問題解決
```bash
# 清除 Functions 快取
firebase functions:delete functionName
firebase deploy --only functions

# 重新安裝依賴
cd functions
rm -rf node_modules package-lock.json
npm install

# 檢查 Firebase CLI 版本
firebase --version

# 更新 Firebase CLI
npm install -g firebase-tools@latest
```

### 測試 Functions
```bash
# 使用 curl 測試 HTTP Functions
curl -X POST \
  https://your-region-your-project.cloudfunctions.net/functionName \
  -H 'Content-Type: application/json' \
  -d '{"test": "data"}'

# 使用 Firebase Test Lab
firebase test:android run --app path/to/app.apk
```

## 📋 快速部署檢查清單

1. **編譯檢查**
   ```bash
   cd functions && npm run build
   ```

2. **設定環境變數**
   ```bash
   firebase functions:config:get
   ```

3. **測試本地模擬器**
   ```bash
   firebase emulators:start --only functions
   ```

4. **部署**
   ```bash
   firebase deploy --only functions
   ```

5. **驗證部署**
   ```bash
   firebase functions:log --lines 10
   ```

## 💡 最佳實務

### 開發流程
1. 在本地使用模擬器開發和測試
2. 使用環境變數管理敏感配置
3. 定期備份 Firestore 資料
4. 監控 Functions 效能和錯誤日誌
5. 使用版本控制管理部署

### 安全注意事項
- 永遠不要將 API keys 提交到版本控制
- 定期檢查和更新 Firestore 安全規則
- 使用最小權限原則設定 IAM 角色
- 啟用 Firebase Security Rules 測試

---

💡 **提示**: 建議將常用指令加入 `package.json` 的 scripts 區段，方便快速執行。