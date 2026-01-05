import { useEffect } from "react";
import { usePopUp } from "@/contexts/PopUpContext";
import PopUp from "@/components/PopUp";

export default function Home() {
  const { showPopUp, updatePopUpConfig, popupContent } = usePopUp();

  useEffect(() => {
    // Get delay from context and show popup after that time
    updatePopUpConfig({
      delay: 2000, // 2 seconds
      enableCookies: true,
      cookieDuration: 1, // Show again after 1 day for testing
    });

    const timer = setTimeout(() => {
      showPopUp();
    }, 2000);

    return () => clearTimeout(timer);
  }, [showPopUp, updatePopUpConfig]);

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col">
      <div className="flex-grow">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Веб-сайт компании</h1>
        <p className="text-gray-600 mb-4">
          Это контент вашего веб-сайта. Всплывающее окно появится через 2 секунды после загрузки страницы.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Sample content cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-3">Наши услуги</h2>
            <p className="text-gray-600">Мы предлагаем широкий спектр услуг для удовлетворения ваших потребностей.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-3">О компании</h2>
            <p className="text-gray-600">Наша компания работает на рынке более 10 лет и зарекомендовала себя как надежный партнер.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-3">Контакты</h2>
            <p className="text-gray-600">Свяжитесь с нами для получения дополнительной информации или консультации.</p>
          </div>
        </div>

        <div className="bg-gray-100 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Наши преимущества</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Качество</h3>
                <p className="text-gray-600">Мы гарантируем высокое качество всех наших продуктов и услуг.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Оперативность</h3>
                <p className="text-gray-600">Мы всегда выполняем работу в срок и ценим ваше время.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-auto py-4 text-center text-gray-500 text-sm">
        &copy; 2025 Ваша Компания. Made with Replit.
      </footer>

      {/* The PopUp component using context values */}
      <PopUp 
        title={popupContent.title}
        description={popupContent.description}
        price={popupContent.price}
        discount={popupContent.discount}
        imageSrc={popupContent.imageSrc}
        amount={popupContent.amount}
      />
    </div>
  );
}
