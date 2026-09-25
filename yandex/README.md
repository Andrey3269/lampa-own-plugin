# Yandex fallback

1. Создай Cloud Function с Node.js.
2. Точка входа: `index.handler`.
3. Загрузить `index.js`, `own.js`, `package.json`.
4. Создай API Gateway и используй `openapi.yaml`.
5. Замени `YOUR_FUNCTION_ID` и `YOUR_SERVICE_ACCOUNT_ID`.
6. Полученный URL добавь вторым backend в `plugin/online.js`.
