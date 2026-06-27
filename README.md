# Cyber Training Workshop — 課後意見問卷

一份簡單嘅課後意見問卷，收集參加者對網絡培訓工作坊嘅反饋。

使用 **Google Apps Script** 將數據寫入 **Google Sheet**，前端以 **GitHub Pages** 免費托管。

## 問卷題目

1. 你的專業背景是？
2. 是次網絡培訓工作坊內容對你了解網絡安全有多大幫助？（1-5 評分）
3. 你對培訓工作坊上嘅內容理解程度？（1-5 評分）
4. 若將來再次舉行培訓工作坊，哪個主題你最感興趣？
5. 你對培訓工作坊有什麼寶貴建議？

## 檔案結構

```
├── survey.html        # 問卷頁面結構
├── survey.css         # 問卷設計（Dark theme）
├── survey.js          # 驗證 + 提交邏輯
└── google-apps-script/
    └── SurveyCode.gs  # Google Apps Script 後端
```

## 部署步驟

見下方指示 👇
