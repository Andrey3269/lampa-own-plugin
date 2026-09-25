# Lampa Own Stack — готовая независимая структура

Проект совместим с текущим Lampa-клиентом из `plugin/online.js` и принимает реальные запросы вида:

- `/api/lite/withsearch?account_email=...&uid=...&nws_id=...`
- `/api/lite/events?life=true&id=...&imdb_id=...&kinopoisk_id=...&title=...&original_title=...&serial=...&original_language=...&year=...&source=...&clarification=0&similar=false&rchtype=web&cub_id=...&account_email=...&uid=...&nws_id=...`
- `/api/externalids?id=...&serial=...&imdb_id=...&account_email=...&uid=...&nws_id=...`

## Что есть сейчас

### Рабочие источники

1. `own` — твой локальный тестовый/собственный каталог.
2. `archive-org` — Internet Archive, но только элементы с найденной лицензией Creative Commons/Public Domain/CC0 и с доступным видеофайлом.
3. `wikimedia` — Wikimedia Commons Video, с фильтрацией по разрешённым открытым лицензиям.
4. `jellyfin` — опционально, включается только при `JELLYFIN_URL` + `JELLYFIN_API_KEY`.

### Каталог имён из Z01/BWA

`providers/catalog.js` содержит все 52 ID, найденные в клиентском списке. Они не включаются автоматически в Lampa, потому что наличие имени в клиентском списке не является доказательством наличия открытого API или разрешения на использование потока.

## Твои адреса

GitHub Pages plugin:

`https://andrey3269.github.io/lampa-own-plugin/plugin/player.js`

Vercel API:

`https://lampa-own-stack.vercel.app/api/`

## Быстрая проверка

После push в GitHub проверь:

```text
https://lampa-own-stack.vercel.app/api/health
https://lampa-own-stack.vercel.app/api/providers
https://lampa-own-stack.vercel.app/api/lite/withsearch?account_email=test%40example.com&uid=test&nws_id=test
```

Для конкретного фильма:

```text
https://lampa-own-stack.vercel.app/api/lite/events?life=true&id=...&imdb_id=...&title=...
```

## Установка

1. Скопируй весь этот проект в репозиторий, подключённый к Vercel.
2. Выполни:

```powershell
git add .
git commit -m "Add open media providers"
git push
```

3. В Vercel дождись нового deployment.
4. GitHub Pages продолжает обслуживать `plugin/` отдельно.

## Optional: TMDB

Положи в Vercel Environment Variables:

```text
TMDB_TOKEN=твой_TMDB_API_Read_Access_Token
```

С этим `/api/externalids` сможет дополнительно уточнять TMDB/IMDb по названию. TMDB требует регистрацию API и согласие с их условиями; документация использует Bearer token для application authentication. См. https://developer.themoviedb.org/docs/authentication-application

TMDB Watch Provider API возвращает данные о стриминговых провайдерах по стране, но это информация о доступности, а не прямые URL видео; также требуется атрибуция JustWatch. Этот endpoint поэтому не используется как плеерный source. См. https://developer.themoviedb.org/reference/movie-watch-providers

## Optional: Jellyfin

В Vercel Environment Variables:

```text
JELLYFIN_URL=https://your-jellyfin.example.com
JELLYFIN_API_KEY=...
JELLYFIN_USER_ID=...
```

Когда `JELLYFIN_URL` и `JELLYFIN_API_KEY` заданы, provider `jellyfin` автоматически появляется в `/api/lite/events`.

Jellyfin предназначен для собственной библиотеки: пользователь сам управляет сервером и медиатекой. См. https://jellyfin.org/docs/

## Добавление нового разрешённого provider

Создай:

```text
providers/my-provider.js
```

с интерфейсом:

```js
module.exports = {
  id: 'my-provider',
  name: 'My Provider',
  enabled: true,
  async search(params) { ... },
  async streams(params) { ... }
};
```

После этого добавь его в `providers/index.js`.

## Почему сюда не включена копия всех закрытых Z01-источников

Клиентские строки `filmix`, `rezka`, `kodik`, `alloha`, `vidsrc` и т. п. сами по себе не являются реализациями backend-провайдеров. Для независимого проекта нужно использовать собственные/публичные/разрешённые API и медиапотоки. Я не переношу закрытые ключи Z01, приватную серверную авторизацию или обход защиты источников.
