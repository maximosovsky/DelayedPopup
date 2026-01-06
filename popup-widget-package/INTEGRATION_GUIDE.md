# Руководство по интеграции виджета в другой проект

## Пошаговая инструкция

### Шаг 1: Подготовка файлов

Скопируйте следующие файлы/папки из этого проекта в ваш новый проект:

```
popup-widget-package/
├── src/
│   ├── components/
│   │   ├── ChatButton.tsx
│   │   ├── PopUp.tsx
│   │   ├── PaymentButton.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       └── dialog.tsx
│   ├── contexts/
│   │   └── PopUpContext.tsx
│   ├── lib/
│   │   ├── cookie.ts
│   │   └── utils.ts
│   ├── styles/
│   │   └── widget.css
│   └── index.ts
├── package.json
├── tailwind.config.js
└── README.md
```

**Рекомендуемое расположение в вашем проекте:**
```
your-project/
├── src/
│   └── popup-widget/  <- скопируйте сюда содержимое src/
├── ...
```

### Шаг 2: Установка зависимостей

Добавьте следующие зависимости в ваш `package.json`:

```bash
npm install @radix-ui/react-dialog@^1.1.2 \
  @radix-ui/react-slot@^1.1.0 \
  @radix-ui/react-toast@^1.2.2 \
  @stripe/react-stripe-js@^3.6.0 \
  @stripe/stripe-js@^7.0.0 \
  class-variance-authority@^0.7.0 \
  clsx@^2.1.1 \
  lucide-react@^0.453.0 \
  tailwind-merge@^2.5.4 \
  tailwindcss-animate
```

### Шаг 3: Настройка Tailwind CSS

#### 3.1. Обновите `tailwind.config.js`

Добавьте путь к виджету в `content` и расширьте тему:

```javascript
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/popup-widget/**/*.{js,jsx,ts,tsx}", // добавьте эту строку
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

#### 3.2. Добавьте CSS переменные

В ваш главный CSS файл (например, `src/index.css` или `src/App.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
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
}

/* Импортируйте стили виджета */
@import './popup-widget/styles/widget.css';
```

### Шаг 4: Настройка TypeScript (если используется)

Создайте или обновите `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Шаг 5: Настройка Backend для Stripe

Создайте endpoint для создания payment intent:

```typescript
// server/routes.ts или аналогичный файл
import Stripe from 'stripe';
import express from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const router = express.Router();

router.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Создание payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    res.json({ 
      clientSecret: paymentIntent.client_secret,
      mock: false 
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

export default router;
```

Добавьте в `.env`:
```
STRIPE_SECRET_KEY=sk_test_your_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_public_key
```

### Шаг 6: Интеграция в React приложение

#### 6.1. Базовая интеграция

```tsx
// src/App.tsx
import { PopUpProvider } from './popup-widget/contexts/PopUpContext';
import ChatButton from './popup-widget/components/ChatButton';
import PopUp from './popup-widget/components/PopUp';
import { usePopUp } from './popup-widget/contexts/PopUpContext';

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
      avatarSrc="/path/to/your/avatar.jpg"
      avatarName="Ваше имя"
    />
  );
}

function App() {
  return (
    <PopUpProvider>
      <div className="App">
        {/* Ваш контент */}
        <YourMainContent />
        
        {/* Виджет */}
        <ChatButton />
        <PopUpWidget />
      </div>
    </PopUpProvider>
  );
}

export default App;
```

#### 6.2. Кастомизация контента

```tsx
// src/components/CustomPopup.tsx
import { useEffect } from 'react';
import { usePopUp } from '../popup-widget/contexts/PopUpContext';
import PopUp from '../popup-widget/components/PopUp';

export function CustomPopup() {
  const { popupContent, updatePopUpContent, updatePopUpConfig } = usePopUp();
  
  useEffect(() => {
    // Настройка контента
    updatePopUpContent({
      title: "Специальное предложение!",
      description: "Получите скидку 50% на наши услуги прямо сейчас!",
      price: "$49",
      discount: "$99",
      imageSrc: "https://your-image-url.com/promo.jpg",
      amount: 4900, // в центах
    });
    
    // Настройка поведения
    updatePopUpConfig({
      cookieName: "myCustomPopup",
      cookieDuration: 14, // показывать раз в 14 дней
      delay: 3000, // задержка 3 секунды
      enableCookies: true,
    });
  }, [updatePopUpContent, updatePopUpConfig]);
  
  return (
    <PopUp
      title={popupContent.title}
      description={popupContent.description}
      price={popupContent.price}
      discount={popupContent.discount}
      imageSrc={popupContent.imageSrc}
      amount={popupContent.amount}
    />
  );
}
```

### Шаг 7: Тестирование

1. **Запустите проект:**
   ```bash
   npm run dev
   ```

2. **Проверьте:**
   - Кнопка чата отображается в правом нижнем углу
   - При клике открывается popup
   - Popup закрывается при клике вне его или на ESC
   - Кнопка оплаты работает (в mock режиме или с реальным Stripe)

### Шаг 8: Mock режим для разработки (опционально)

Если хотите тестировать без настройки Stripe:

```typescript
// server/routes.ts
router.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  
  // Mock режим для разработки
  if (process.env.STRIPE_MOCK === 'true') {
    res.json({ 
      clientSecret: 'mock_client_secret',
      mock: true 
    });
    return;
  }
  
  // Реальный Stripe код...
});
```

Добавьте в `.env`:
```
STRIPE_MOCK=true
VITE_STRIPE_MOCK=true
```

## Структура файлов после интеграции

```
your-project/
├── src/
│   ├── popup-widget/           # Скопированные файлы виджета
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── lib/
│   │   ├── styles/
│   │   └── index.ts
│   ├── App.tsx                 # Ваше приложение с интегрированным виджетом
│   ├── index.css               # С импортированными стилями виджета
│   └── ...
├── server/                     # Backend с Stripe endpoint
│   └── routes.ts
├── .env                        # Stripe ключи
├── tailwind.config.js          # Обновленная конфигурация
├── package.json                # С добавленными зависимостями
└── ...
```

## Частые проблемы и решения

### Проблема: Стили не применяются

**Решение:** Убедитесь, что:
1. Импортировали `widget.css` в главный CSS файл
2. Добавили путь к виджету в `tailwind.config.js`
3. CSS переменные определены в `:root`

### Проблема: TypeScript ошибки

**Решение:** Проверьте `paths` в `tsconfig.json`:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

### Проблема: Stripe не работает

**Решение:**
1. Проверьте `.env` файл с ключами
2. Убедитесь, что backend endpoint `/api/create-payment-intent` работает
3. Проверьте, что передаете `stripePublicKey` в `PaymentButton`

## Дополнительная кастомизация

### Изменение цветов

Измените CSS переменные в вашем CSS файле:

```css
:root {
  --primary: 280 100% 70%; /* фиолетовый */
  --primary-foreground: 0 0% 100%;
}
```

### Изменение позиции кнопки

Отредактируйте `ChatButton.tsx`:

```tsx
// Изменить с bottom-5 right-5 на нужные значения
className="fixed bottom-10 left-10 ..."
```

### Добавление своих обработчиков

```tsx
<PaymentButton 
  amount={9900}
  stripePublicKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}
  onSuccess={() => {
    console.log('Платеж успешен!');
    // Ваша логика
  }}
  onError={(error) => {
    console.error('Ошибка:', error);
    // Ваша логика обработки ошибок
  }}
/>
```

## Поддержка

Если возникли проблемы, проверьте:
1. Все зависимости установлены
2. Tailwind настроен правильно
3. CSS переменные определены
4. Backend endpoint работает
5. Stripe ключи корректны

Удачной интеграции! 🚀
