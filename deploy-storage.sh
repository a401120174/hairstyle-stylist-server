#!/bin/bash

echo "🚀 部署 Firebase Storage 設置..."

# 1. 部署 Storage 規則
echo "📋 部署 Storage 安全規則..."
firebase deploy --only storage

if [ $? -eq 0 ]; then
    echo "✅ Storage 規則部署成功！"
else
    echo "❌ Storage 規則部署失敗"
    exit 1
fi

# 2. 上傳髮型模板圖片
echo "📁 開始上傳髮型模板圖片..."

# 檢查髮型圖片檔案是否存在
if [ ! -d "hair" ]; then
    echo "❌ hair 目錄不存在"
    exit 1
fi

# 使用 gsutil 上傳檔案
echo "⬆️  上傳 classic-pompadour.png..."
gsutil cp hair/classic-pompadour.png gs://hairstyle-stylish.appspot.com/hairstyles/classic-pompadour.png

echo "⬆️  上傳 fade-buzz-cut.png..."
gsutil cp hair/fade-buzz-cut.png gs://hairstyle-stylish.appspot.com/hairstyles/fade-buzz-cut.png

echo "⬆️  上傳 messy-short-curls.png..."
gsutil cp "hair/messy-short curls.png" gs://hairstyle-stylish.appspot.com/hairstyles/messy-short-curls.png

# 檢查是否有 short-bob.jpg
if [ -f "hair/short-bob.jpg" ]; then
    echo "⬆️  上傳 short-bob.jpg..."
    gsutil cp hair/short-bob.jpg gs://hairstyle-stylish.appspot.com/hairstyles/short-bob.jpg
else
    echo "⚠️  找不到 short-bob.jpg 檔案"
fi

# 設定公開讀取權限
echo "🔓 設定圖片公開存取權限..."
gsutil -m acl ch -r -u AllUsers:R gs://hairstyle-stylish.appspot.com/hairstyles/

# 列出上傳的檔案
echo "📋 已上傳的髮型模板："
gsutil ls gs://hairstyle-stylish.appspot.com/hairstyles/

echo "🎉 Storage 設置和圖片上傳完成！"
echo "🔗 您的髮型模板現在可以通過以下 URL 存取："
echo "   https://storage.googleapis.com/hairstyle-stylish.appspot.com/hairstyles/classic-pompadour.png"
echo "   https://storage.googleapis.com/hairstyle-stylish.appspot.com/hairstyles/fade-buzz-cut.png"
echo "   https://storage.googleapis.com/hairstyle-stylish.appspot.com/hairstyles/messy-short-curls.png"