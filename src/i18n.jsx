// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Govigyaan Billing',
      login: 'Login',
      logout: 'Logout',
      username: 'Enter your name',
      adminLogin: 'Admin Login',
      frontPageTitle: 'Choose an Option',
      scanQR: 'Scan QR',
      downloadBills: 'Download Previous Bills',
      cartPreview: 'Cart Preview',
      confirmPayment: 'Confirm Payment',
      downloadPDF: 'Download PDF',
      goHome: 'Go to Front Page',
      // add more as needed
    }
  },
  hi: {
    translation: {
      welcome: 'गौविज्ञान बिलिंग में आपका स्वागत है',
      login: 'लॉगिन',
      logout: 'लॉग आउट',
      username: 'अपना नाम दर्ज करें',
      adminLogin: 'प्रशासक लॉगिन',
      frontPageTitle: 'एक विकल्प चुनें',
      scanQR: 'क्यूआर स्कैन करें',
      downloadBills: 'पिछले बिल डाउनलोड करें',
      cartPreview: 'कार्ट पूर्वावलोकन',
      confirmPayment: 'भुगतान की पुष्टि करें',
      downloadPDF: 'पीडीएफ डाउनलोड करें',
      goHome: 'मुख्य पृष्ठ पर जाएं',
      // translate more as needed
    }
  }
};

i18n
  .use(LanguageDetector) // detects browser language
  .use(initReactI18next) // connects with React
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already escapes
    }
  });

export default i18n;
