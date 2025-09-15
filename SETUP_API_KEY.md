# 設定 Gemini API Key
# 請將您的 Gemini API Key 替換 YOUR_ACTUAL_API_KEY
firebase functions:config:set gemini.api_key="YOUR_ACTUAL_API_KEY"

# 或者您可以使用 .env 檔案的方式（推薦）
# 1. 在 functions 目錄下建立 .env 檔案
# 2. 新增以下內容：
# GEMINI_API_KEY=YOUR_ACTUAL_API_KEY

# 獲取 Gemini API Key 的步驟：
# 1. 前往 Google AI Studio: https://aistudio.google.com/
# 2. 登入您的 Google 帳號
# 3. 點擊 "Get API key"
# 4. 建立新的 API key
# 5. 複製 API key 並設定到環境變數中