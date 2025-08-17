# 🔧 Discord Bot Token設定手順（緊急復旧）

## 📋 Step 1: Discord Developer Portalでの新Botトークン取得

### 1.1 Discord Developer Portalアクセス
```
https://discord.com/developers/applications
```

### 1.2 新しいアプリケーション作成
1. **「New Application」**をクリック
2. **名前**: `AI副業サロンBot`
3. **「Create」**をクリック

### 1.3 Bot設定
1. 左メニュー **「Bot」**をクリック
2. **「Add Bot」**をクリック
3. **「Reset Token」**をクリック（新しいトークン生成）
4. **トークンをコピー**（これが必要なトークン）

### 1.4 重要な権限設定
**必須設定 - これを忘れると動作しません**:
```
✅ PUBLIC BOT: オン
✅ MESSAGE CONTENT INTENT: オン（最重要！）
✅ SERVER MEMBERS INTENT: オン
✅ PRESENCE INTENT: オン
```

## 📋 Step 2: .envファイルにトークン設定

### 2.1 .envファイル編集
```bash
# ファイルを開く
nano .env
```

### 2.2 DISCORD_TOKENを実際のトークンに変更
```env
# この行を見つけて、YOUR_BOT_TOKEN_HEREを実際のトークンに置換
DISCORD_TOKEN=YOUR_ACTUAL_BOT_TOKEN_HERE
```

## 📋 Step 3: Bot権限URL生成

### 3.1 OAuth2設定
1. 左メニュー **「OAuth2」** → **「URL Generator」**
2. **Scopes**:
   ```
   ✅ bot
   ✅ applications.commands
   ```
3. **Bot Permissions**:
   ```
   ✅ Manage Roles
   ✅ Manage Channels
   ✅ View Channels
   ✅ Send Messages
   ✅ Manage Messages
   ✅ Embed Links
   ✅ Read Message History
   ✅ Add Reactions
   ```

### 3.2 招待URLコピー
- 生成されたURLをコピー
- このURLでBotをサーバーに招待

## 📋 Step 4: 動作確認

### 4.1 必要な環境変数が設定されているか確認
```bash
python3 -c "
import os
from dotenv import load_dotenv
load_dotenv()
token = os.getenv('DISCORD_TOKEN')
if token and len(token) > 50:
    print('✅ Discord Token 設定済み')
else:
    print('❌ Discord Token 未設定または無効')
"
```

### 4.2 Discord Bot起動テスト
```bash
python3 discord/salon_channel_setup.py
```

**成功の場合**: "✅ セットアップ完了" メッセージ表示
**失敗の場合**: "❌ DISCORD_TOKEN が設定されていません" エラー

## 🚨 緊急時のトラブルシューティング

### Token形式確認
正しいToken形式：
```
MTM5ODY1NDU3MTc2MDMyNDY5OA.GdW0oc.AbCdEfGhIjKlMnOpQrStUvWxYz
```

### 一般的なエラー
1. **401 Unauthorized**: Tokenが間違っている
2. **Missing Intents**: MESSAGE CONTENT INTENTが無効
3. **403 Forbidden**: Bot権限が不足

---

**⚠️ 重要**: このファイルの手順完了後、実際にDiscord Botが動作することを確認してください。