# Интерактивное всплывающее окно с платежной интеграцией Stripe

## Файлы для экспорта

1. **PopUp.tsx** - основной компонент всплывающего окна
2. **PaymentButton.tsx** - компонент кнопки оплаты через Stripe
3. **PopUpContext.tsx** - контекст для управления состоянием всплывающего окна
4. **cookie.ts** - утилиты для работы с куки (отслеживание показа окна)
5. **routes.ts** - серверный код для интеграции с API Stripe
6. **index.css** - стили с кастомными классами для всплывающего окна

## Необходимые зависимости

### Frontend
- React
- @stripe/react-stripe-js
- @stripe/stripe-js
- Tailwind CSS

### Backend
- Express
- Stripe

## Как интегрировать в ваш проект

1. Скопируйте файлы в соответствующие директории вашего проекта
2. Установите все необходимые зависимости
3. Добавьте следующие параметры в ваш `.env` файл:
   ```
   STRIPE_SECRET_KEY=ваш_секретный_ключ
   VITE_STRIPE_PUBLIC_KEY=ваш_публичный_ключ
   ```
4. Интегрируйте `PopUpProvider` в корневой компонент вашего приложения:
   ```jsx
   import { PopUpProvider } from './contexts/PopUpContext';
   
   function App() {
     return (
       <PopUpProvider>
         {/* ваше приложение */}
       </PopUpProvider>
     );
   }
   ```
5. На странице, где должно появляться всплывающее окно, добавьте:
   ```jsx
   import PopUp from './components/PopUp';
   import { usePopUp } from './contexts/PopUpContext';
   
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

## Кастомизация

Для изменения внешнего вида или поведения попапа:

- **Время появления**: Измените параметр `delay` в `PopUpContext.tsx`
- **Текст и цены**: Используйте функцию `updatePopUpContent`
- **Внешний вид**: Редактируйте CSS классы в `PopUp.tsx`

## Примечания по интеграции Stripe

- Необходимо создать маршрут `/api/create-payment-intent` на вашем сервере (код предоставлен в `routes.ts`)
- Для тестирования используйте тестовые ключи Stripe
- В продакшн режиме обязательно используйте HTTPS для безопасности