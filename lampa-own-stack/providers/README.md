# Providers

Каждый provider должен экспортировать:

```js
{
  id: 'unique-id',
  name: 'Display Name',
  enabled: true,
  async search(params) {},
  async streams(params) {}
}
```

`search()` отвечает на вопрос: есть ли у источника результат по фильму.

`streams()` возвращает Lampa rows:

```js
{
  method: 'play',
  text: 'Original',
  title: 'Movie',
  url: 'https://...',
  voice_name: 'Original',
  quality: { 1080: 'https://...' }
}
```
