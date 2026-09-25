# Providers

Каждый источник — отдельный адаптер в этой папке.

Минимальный контракт:

```js
module.exports = {
  id: 'source-id',
  name: 'Название источника',
  async search(params) {
    // true, если источник нашёл фильм/сериал
    return true;
  },
  async streams(params) {
    // массив строк Lampa: method=play или method=link
    return [];
  }
};
```

После добавления файла зарегистрируй его в `providers/index.js`.

Не переноси в provider закрытые API, чужие токены, Premium-ключи, cookie или обходы авторизации. Используй официальные/разрешённые интерфейсы и свои ключи через переменные окружения.
