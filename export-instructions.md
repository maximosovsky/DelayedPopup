# Инструкция по экспорту и интеграции компонента всплывающего окна

## Доступные файлы для экспорта

Я подготовил следующие файлы для экспорта:

1. **Пакет npm**: `popup-stripe-package.tgz` - полный npm-пакет, который вы можете установить в другом проекте.
2. **Отдельные файлы** в папке `export-files`:
   - `PopUp.tsx` - основной компонент всплывающего окна
   - `PaymentButton.tsx` - компонент кнопки оплаты через Stripe
   - `PopUpContext.tsx` - контекст для управления состоянием окна
   - `cookie.ts` - утилиты для работы с куки
   - `routes.ts` - серверный код для интеграции с API Stripe
   - `index.css` - стили с кастомными классами для всплывающего окна
   - `README.md` - подробная документация

## Способы экспорта

### Вариант 1: Установка npm-пакета в другой проект

1. Скопируйте файл `popup-stripe-package.tgz` в корневую директорию вашего проекта.
2. Установите пакет локально:
   ```bash
   npm install ./popup-stripe-package.tgz
   ```
3. Импортируйте компоненты в вашем коде:
   ```jsx
   import { PopUp, PopUpProvider, usePopUp } from 'popup-stripe-component';
   ```

### Вариант 2: Копирование отдельных файлов

1. Скопируйте необходимые файлы из папки `export-files` в соответствующие директории вашего проекта:
   - `.tsx` файлы в папку с компонентами
   - `cookie.ts` в папку с утилитами
   - `routes.ts` в серверную часть вашего приложения
   - Добавьте стили из `index.css` в ваш CSS файл

2. Обновите импорты в скопированных файлах, чтобы они соответствовали структуре вашего проекта.

## Интеграция в ваш проект

1. **Настройте переменные окружения:**
   ```
   STRIPE_SECRET_KEY=ваш_секретный_ключ
   VITE_STRIPE_PUBLIC_KEY=ваш_публичный_ключ
   ```

2. **Добавьте контекст в корневой компонент:**
   ```jsx
   import { PopUpProvider } from './path/to/PopUpContext';
   
   function App() {
     return (
       <PopUpProvider>
         {/* ваше приложение */}
       </PopUpProvider>
     );
   }
   ```

3. **Добавьте всплывающее окно на нужную страницу:**
   ```jsx
   import PopUp from './path/to/PopUp';
   import { usePopUp } from './path/to/PopUpContext';
   
   function YourPage() {
     const { popupContent, updatePopUpContent } = usePopUp();
     
     // При желании можно обновить контент попапа
     useEffect(() => {
       updatePopUpContent({
         title: "Ваш заголовок",
         description: "Ваше описание",
         price: "$99",
         discount: "$160",
         amount: 9900, // в центах
       });
     }, []);
     
     return (
       <>
         <PopUp 
           title={popupContent.title}
           description={popupContent.description}
           price={popupContent.price}
           discount={popupContent.discount}
           amount={popupContent.amount}
         />
         {/* остальное содержимое страницы */}
       </>
     );
   }
   ```

4. **Настройте серверный маршрут для Stripe:**
   Добавьте код из файла `routes.ts` в ваше серверное приложение.

## Кастомизация компонента

Для изменения внешнего вида или поведения попапа:

- **Время появления**: Измените параметр `delay` в `PopUpContext.tsx`
- **Текст и цены**: Используйте функцию `updatePopUpContent`
- **Внешний вид**: Редактируйте CSS классы в `PopUp.tsx` или в вашем CSS файле

## Помощь в интеграции

Если у вас возникнут вопросы по интеграции компонента в ваш проект, вы можете обратиться за дополнительной помощью.