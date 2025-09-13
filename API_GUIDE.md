# 髮型 AI API 使用指南

## API 端點

### 1. 健康檢查
```
GET /api/health
```

### 2. 獲取髮型提示範本
```
GET /api/hairstyle/prompts
```

**回應範例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "現代短髮",
      "prompt": "Change this person's hairstyle to a modern short bob cut with clean lines and a professional look"
    }
  ],
  "message": "Hairstyle prompts retrieved successfully"
}
```

### 3. 生成新髮型
```
POST /api/hairstyle/generate
Content-Type: application/json
```

**請求格式：**
```json
{
  "userImage": {
    "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "mimeType": "image/jpeg"
  },
  "hairstylePrompt": "Change this person's hairstyle to a modern short bob cut"
}
```

**回應格式：**
```json
{
  "success": true,
  "generatedImageBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "message": "Hairstyle generated successfully"
}
```

## 錯誤處理

### 400 Bad Request
- 缺少必要欄位
- 不支援的圖片格式
- 無效的輸入資料

### 500 Internal Server Error
- Google API 金鑰未設定
- AI 服務呼叫失敗
- 其他伺服器錯誤

## 支援的圖片格式
- JPEG (image/jpeg)
- PNG (image/png) 
- WebP (image/webp)

## 使用範例 (JavaScript)

```javascript
// 1. 獲取髮型提示
async function getHairstylePrompts() {
  const response = await fetch('http://localhost:3000/api/hairstyle/prompts');
  const data = await response.json();
  return data.data;
}

// 2. 生成新髮型
async function generateHairstyle(imageFile, prompt) {
  // 將圖片轉為 base64
  const base64 = await fileToBase64(imageFile);
  
  const response = await fetch('http://localhost:3000/api/hairstyle/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userImage: {
        base64: base64,
        mimeType: imageFile.type
      },
      hairstylePrompt: prompt
    })
  });
  
  const result = await response.json();
  return result;
}

// 輔助函數：檔案轉 base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
```