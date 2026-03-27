# Session 04 — Админка: Фаза 6

**Дата:** 2026-03-27
**Инструмент:** Claude Code (claude-sonnet-4-6), VSCode Extension
**Охват:** Фаза 6 — управление товарами в админке

---

## Итог

Реализован полный CRUD-интерфейс администратора: таблица товаров, форма создания/редактирования товара с атрибутами и загрузкой изображения, управление офферами.

---

## Что создано

### `entities/product/api/adminApi.ts`

Все функции для работы с API админки:

| Функция | Метод | URL |
|---------|-------|-----|
| `getAdminProducts(offset, limit)` | GET | `/v1/admin/products` |
| `getAdminProduct(id)` | GET | `/v1/admin/products/:id` |
| `createProduct(data)` | POST | `/v1/admin/products` |
| `updateProduct(id, data)` | PUT | `/v1/admin/products/:id` |
| `deleteProduct(id)` | DELETE | `/v1/admin/products/:id` |
| `uploadProductImage(id, file)` | POST | `/v1/admin/products/:id/image` |
| `getProductOffers(productId)` | GET | `/v1/admin/products/:id/offers` |
| `createOffer(productId, data)` | POST | `/v1/admin/products/:id/offers` |
| `updateOffer(offerId, data)` | PUT | `/v1/admin/offers/:id` |
| `deleteOffer(offerId)` | DELETE | `/v1/admin/offers/:id` |
| `getSellers()` | GET | `/v1/admin/sellers` |

Экспортируемые типы: `ProductFormData`, `OfferFormData`.

---

### `pages/admin/products/ui/AdminProductsPage.vue`

Главный экран управления товарами.

- Загружает первые 100 товаров (`getAdminProducts(0, 100)`) при монтировании
- Таблица: ID, Название, Цена, Остаток, Действия
- Действия в каждой строке: **Редактировать** → открывает `ProductFormModal`, **Офферы** → открывает `OfferFormModal`, **Удалить** → `confirm()` + DELETE
- Шапка: кнопка «+ Добавить товар» и «Выйти» (через `useAuth().logout()`)
- Состояния: loading (спиннер), error, пустой список

---

### `pages/admin/products/ui/ProductFormModal.vue`

Модальное окно создания и редактирования товара.

**Props:** `productId: number | null` (null = режим создания)
**Emits:** `close`, `saved`

**Поля формы:**
- Название (required), Цена (number, required), Валюта (default: RUB), Остаток (number, required), Описание (textarea)

**Секция атрибутов:**
- Динамический список пар ключ/значение
- Кнопка «+ Добавить» — добавляет пустую строку
- Кнопка «✕» у каждой строки — удаляет

**Секция изображения:**
- Превью текущего фото (если редактирование)
- `<input type="file" accept="image/*">`

**Логика сохранения:**
- *Создание:* POST базовых полей → если атрибуты: PUT с `attributes` → если файл: POST image
- *Редактирование:* один PUT со всеми полями включая `attributes` → если новый файл: POST image

---

### `pages/admin/products/ui/OfferFormModal.vue`

Модальное окно управления офферами конкретного товара.

**Props:** `productId: number`
**Emits:** `close`

**При монтировании:** параллельная загрузка офферов и списка продавцов через `Promise.all`.

**Список офферов:**
- Таблица: продавец, цена, дата доставки, кнопки ✎/✕
- Удаление с `confirm()`

**Форма оффера (добавить / редактировать):**
- Select продавца из загруженного списка (имя + рейтинг)
- Цена, Валюта, Дата доставки (`type="date"`)
- Inline режим: кнопка ✎ заполняет форму, «Отмена» сбрасывает в режим добавления
- После сохранения: локальное обновление массива `offers` (без повторного запроса)

---

## Архитектурные решения

**Модалки, не страницы:**
Форма товара и управление офферами реализованы как overlay-модалки, не как отдельные роуты (`/admin/products/:id/edit`). Обоснование: не нужен дополнительный роутинг, состояние проще, UX быстрее.

**Локальное обновление офферов:**
После создания/редактирования/удаления оффера массив `offers` обновляется локально — не делается повторный GET-запрос. Ответ от POST/PUT содержит полный объект оффера с вложенным seller.

**Разделение API:**
Публичные функции (`getProducts`, `getProduct`) и админские (`getAdminProducts`, `createProduct`, ...) живут в отдельных файлах `productApi.ts` и `adminApi.ts` в рамках одного слайса `entities/product/api/`. Экспортируются через единый `index.ts`.

**Загрузка изображения:**
`multipart/form-data` собирается через нативный `FormData`, axios автоматически выставляет правильный `Content-Type` с boundary.

---

## Проблем не было

Сборка прошла чисто с первой попытки. TypeScript strict mode (noUnusedLocals, noUnusedParameters) ошибок не выдал.

---

## Файловая структура после сессии

```
src/
  entities/product/
    api/
      productApi.ts    ← публичные запросы
      adminApi.ts      ← CRUD админки (новый)
      index.ts         ← обновлён, экспортирует всё
    index.ts           ← обновлён
  pages/admin/products/ui/
    AdminProductsPage.vue   ← новый
    ProductFormModal.vue    ← новый
    OfferFormModal.vue      ← новый
```
