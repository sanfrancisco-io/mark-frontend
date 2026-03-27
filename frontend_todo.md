# TODO  — marketplace-frontend

## Стек и решения
- Vue 3 + TypeScript
- Vite
- Архитектура: Feature-Sliced Design (FSD)
- HTTP клиент: axios (или fetch — уточни после первой сессии)
- Принятые решения: (заполни после первой сессии)

## Структура проекта (FSD)
```
marketplace-frontend/
  src/
    app/
      router/       ← vue-router, роут-гарды
      store/        ← глобальное состояние (если нужно)
      main.ts
    pages/
      catalog/      ← главная страница со списком товаров
      product/      ← детализация товара
      admin/
        login/      ← страница логина
        products/   ← управление товарами
    widgets/
      product-card/ ← карточка товара (для каталога)
      product-modal/← попап детализации
      offers-list/  ← список предложений с сортировкой
    features/
      auth/         ← логин, хранение токена, logout
      infinite-scroll/ ← бесконечная подгрузка
    entities/
      product/
        model/      ← типы: Product, ProductDetail, Offer
        api/        ← getProducts, getProduct
      seller/
        model/      ← тип Seller
    shared/
      api/          ← базовый http клиент, базовый URL
      ui/           ← Button, Spinner, Badge и т.д.
      lib/          ← утилиты
  docs/ai/
    AI_WORKFLOW.md
    sessions/
  Dockerfile
  .env.example
```

## Переменные окружения (.env.example)
```
VITE_API_URL=http://localhost:8000
```

## Текущие проблемы
- нет

---

## Фаза 1 — Настройка проекта

- [x] Создать Vue 3 + TypeScript + Vite проект
- [x] Настроить FSD структуру папок: app/, pages/, widgets/, features/, entities/, shared/
- [x] Настроить shared/api/ — базовый http клиент с VITE_API_URL
- [x] Создать .env.example с VITE_API_URL=http://localhost:8000
- [x] Создать Dockerfile для frontend

## Фаза 2 — Entities и shared

- [x] Создать entities/product/model — типы Product, ProductDetail, Offer, Seller
- [x] Создать entities/product/api — функции getProducts(offset, limit), getProduct(id)
- [x] Создать shared/ui — базовые компоненты (AppButton, AppSpinner, AppBadge)
- [x] Проверить: API вызов getProducts() возвращает данные из backend

## Фаза 3 — Главная страница (каталог)

- [x] Создать pages/catalog/ui — страница каталога
- [x] Создать widgets/product-card/ui — карточка: фото, название, цена, остаток, дата доставки
- [x] Отображать сетку карточек при загрузке страницы
- [x] Реализовать infinite scroll через IntersectionObserver
- [x] При скролле вниз — подгружать следующую страницу из API
- [x] Проверить: 100+ карточек подгружаются порциями по 20

## Фаза 4 — Карточка товара (детализация)

- [x] Создать pages/product/ui — страница детализации /product/:id
- [x] Отображать основное изображение товара
- [x] Отображать атрибуты товара (таблица ключ-значение)
- [x] Создать widgets/offers-list — список offers: продавец, рейтинг, цена, дата
- [x] Кнопки сортировки: по цене / по дате доставки
- [x] По умолчанию при открытии — сортировка по цене
- [x] Клик по карточке на главной открывает детализацию


## Фаза 5 — Админка (авторизация)

- [x] Создать pages/admin/login — форма логин + пароль
- [x] POST /v1/admin/auth/login — сохранить токен в localStorage
- [x] Создать features/auth — хранение токена, logout
- [x] Настроить роут-гард: /admin/* редиректит на /login если нет токена
- [x] Проверить: логин работает, неверный пароль показывает ошибку

## Фаза 6 — Админка (управление товарами)

- [x] Создать pages/admin/products — таблица всех товаров
- [x] Кнопка создать товар — форма (название, цена, остаток)
- [x] Кнопка редактировать — заполненная форма товара
- [x] Загрузка изображения через input type=file → POST /image
- [x] Управление атрибутами: добавить/удалить пару ключ-значение
- [x] Управление offers: список + добавить/изменить/удалить offer
- [x] Кнопка удалить товар с подтверждением
- [x] Infinite scroll в таблице товаров
- [x] Поиск по названию (клиентский, по загруженным товарам)

## Фаза 7 — Финальная проверка

- [x] Базовая адаптивность (мобильный вид не сломан)
- [x] Все импорты через public API слайсов (не через внутренности папок)
- [x] Проверить весь флоу: главная → карточка → админка → создать товар → увидеть на главной
- [x] Сохранить AI-сессии в docs/ai/sessions/

---

## Лог сессий
- (заполняй после каждой сессии)
- [дата] Фаза X — что сделали, сколько итераций, что сломалось
