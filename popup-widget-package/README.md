# Delayed Popup Widget

Модульный виджет с чат-кнопкой и всплывающим окном с интеграцией Stripe для приема платежей.

## Возможности

- 💬 **Анимированная чат-кнопка** - привлекает внимание пользователей
- 🎨 **Красивый popup в стиле Intercom** - современный дизайн
- 💳 **Интеграция Stripe** - безопасные платежи
- 🍪 **Cookie-управление** - контроль частоты показа
- ⚙️ **Полная кастомизация** - настройка контента и стилей
- 📱 **Адаптивный дизайн** - работает на всех устройствах

## Установка

### Вариант 1: Копирование файлов (рекомендуется)

1. Скопируйте папку `src` в ваш проект
2. Установите зависимости:

```bash
npm install @radix-ui/react-dialog @radix-ui/react-slot @radix-ui/react-toast @stripe/react-stripe-js @stripe/stripe-js class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate
```

### Вариант 2: Как npm пакет (локально)

```bash
npm install /path/to/popup-widget-package
```

## Быстрый старт

### 1. Импортируйте стили

В вашем главном CSS файле:

```css
@import '@delayed-popup/widget/src/styles/widget.css';
/* или если копировали файлы напрямую */
@import './path/to/src/styles/widget.css';
```

### 2. Настройте Tailwind

Добавьте в ваш `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    // ваши существующие пути
    './node_modules/@delayed-popup/widget/src/**/*.{js,jsx,ts,tsx}',
    // или если копировали файлы
    './src/popup-widget/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // скопируйте настройки из tailwind.config.js пакета
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 3. Добавьте CSS переменные

В вашем главном CSS файле добавьте:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}
```

### 4. Интегрируйте в ваше приложение

```tsx
import { PopUpProvider, ChatButton, PopUp, usePopUp } from '@delayed-popup/widget';
// или если копировали файлы
// import { PopUpProvider, ChatButton, PopUp, usePopUp } from './popup-widget/src';

function App() {
  return (
    <PopUpProvider>
      {/* Ваше приложение */}
      <YourContent />
      
      {/* Чат-кнопка */}
      <ChatButton />
      
      {/* Popup компонент */}
      <PopUpWidget />
    </PopUpProvider>
  );
}

function PopUpWidget() {
  const { popupContent } = usePopUp();
  
  return (
    <PopUp
      title={popupContent.title}
      description={popupContent.description}
      price={popupContent.price}
      discount={popupContent.discount}
      imageSrc={popupContent.imageSrc}
      amount={popupContent.amount}
      avatarSrc="/path/to/avatar.jpg" // опционально
      avatarName="Ваше имя" // опционально
    />
  );
}
```

## Настройка контента

### Изменение контента popup

```tsx
import { usePopUp } from '@delayed-popup/widget';

function YourComponent() {
  const { updatePopUpContent } = usePopUp();
  
  useEffect(() => {
    updatePopUpContent({
      title: "Ваш заголовок",
      description: "Ваше описание",
      price: "$99",
      discount: "$150",
      imageSrc: "https://your-image-url.com/image.jpg",
      amount: 9900, // в центах
    });
  }, []);
}
```

### Настройка поведения popup

```tsx
import { usePopUp } from '@delayed-popup/widget';

function YourComponent() {
  const { updatePopUpConfig } = usePopUp();
  
  useEffect(() => {
    updatePopUpConfig({
      cookieName: "myPopupShown",
      cookieDuration: 30, // дней
      delay: 3000, // миллисекунд
      enableCookies: true,
    });
  }, []);
}
```

## Настройка Stripe

### Backend (Express пример)

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Frontend настройка

```tsx
<PaymentButton 
  amount={9900} // в центах
  stripePublicKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}
  apiEndpoint="/api/create-payment-intent"
  onSuccess={() => console.log('Payment successful!')}
  onError={(error) => console.error('Payment error:', error)}
/>
```

## API

### PopUpProvider

Провайдер контекста для управления состоянием popup.

**Props:** 
- `children: ReactNode`

### ChatButton

Анимированная кнопка чата.

**Props:** Нет

### PopUp

Компонент всплывающего окна.

**Props:**
- `title: string` - заголовок
- `description: string` - описание
- `price: string` - цена (отображаемая)
- `discount?: string` - старая цена (опционально)
- `imageSrc?: string` - URL изображения (опционально)
- `amount: number` - сумма в центах для Stripe
- `avatarSrc?: string` - URL аватара (опционально)
- `avatarName?: string` - имя для отображения (по умолчанию "Georgie")

### PaymentButton

Кнопка оплаты с интеграцией Stripe.

**Props:**
- `amount: number` - сумма в центах
- `buttonRef?: React.RefObject<HTMLButtonElement>` - ref для кнопки
- `stripePublicKey?: string` - публичный ключ Stripe
- `apiEndpoint?: string` - endpoint для создания payment intent (по умолчанию "/api/create-payment-intent")
- `onSuccess?: () => void` - callback при успешной оплате
- `onError?: (error: string) => void` - callback при ошибке

### usePopUp Hook

**Возвращает:**
- `isOpen: boolean` - открыт ли popup
- `showPopUp: () => void` - показать popup
- `hidePopUp: () => void` - скрыть popup
- `updatePopUpConfig: (config: Partial<PopUpConfig>) => void` - обновить конфигурацию
- `popupContent: PopUpContent` - текущий контент
- `updatePopUpContent: (content: Partial<PopUpContent>) => void` - обновить контент

## Кастомизация стилей

Вы можете переопределить стили, изменив CSS переменные или добавив свои классы Tailwind:

```css
/* Изменить цвет кнопки */
.your-custom-class {
  --primary: 280 100% 70%; /* фиолетовый */
}
```

## Примеры использования

### Программный вызов popup

```tsx
function YourButton() {
  const { showPopUp } = usePopUp();
  
  return (
    <button onClick={showPopUp}>
      Открыть предложение
    </button>
  );
}
```

### Автоматический показ с задержкой

```tsx
function AutoPopup() {
  const { showPopUp } = usePopUp();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      showPopUp();
    }, 5000); // показать через 5 секунд
    
    return () => clearTimeout(timer);
  }, [showPopUp]);
  
  return null;
}
```

## Требования

- React 18+
- TailwindCSS 3+
- Node.js 16+

## Лицензия

MIT
