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

- [ ] Создать pages/product/ui — страница или попап детализации
- [ ] Отображать основное изображение товара
- [ ] Отображать атрибуты товара (таблица ключ-значение)
- [ ] Создать widgets/offers-list — список offers: продавец, рейтинг, цена, дата
- [ ] Кнопки сортировки: по цене / по дате доставки
- [ ] По умолчанию при открытии — сортировка по цене
- [ ] Клик по карточке на главной открывает детализацию

## Фаза 5 — Админка (авторизация)

- [ ] Создать pages/admin/login — форма логин + пароль
- [ ] POST /v1/admin/auth/login — сохранить токен в localStorage
- [ ] Создать features/auth — хранение токена, logout
- [ ] Настроить роут-гард: /admin/* редиректит на /login если нет токена
- [ ] Проверить: логин работает, неверный пароль показывает ошибку

## Фаза 6 — Админка (управление товарами)

- [ ] Создать pages/admin/products — таблица всех товаров
- [ ] Кнопка создать товар — форма (название, цена, остаток)
- [ ] Кнопка редактировать — заполненная форма товара
- [ ] Загрузка изображения через input type=file → POST /image
- [ ] Управление атрибутами: добавить/удалить пару ключ-значение
- [ ] Управление offers: список + добавить/изменить/удалить offer
- [ ] Кнопка удалить товар с подтверждением

## Фаза 7 — Финальная проверка

- [ ] Базовая адаптивность (мобильный вид не сломан)
- [ ] Все импорты через public API слайсов (не через внутренности папок)
- [ ] Проверить весь флоу: главная → карточка → админка → создать товар → увидеть на главной
- [ ] Сохранить AI-сессии в docs/ai/sessions/

---

## Лог сессий
- (заполняй после каждой сессии)
- [дата] Фаза X — что сделали, сколько итераций, что сломалось
