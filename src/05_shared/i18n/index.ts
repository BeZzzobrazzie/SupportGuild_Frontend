import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// const resources = {
//   en: {
//     translation: {
//       "Welcome to React": "Welcome to React and react-i18next",
//     },
//   },
//   ru: {
//     translation: {
//       "Welcome to React": "Bienvenue à React et react-i18next",
//     },
//   },
// };

i18n
  .use(HttpBackend) // Подключаем бэкенд для загрузки переводов
  .use(LanguageDetector) // Подключаем детектор языка
  .use(initReactI18next) // Подключаем React-интеграцию
  .init({
    fallbackLng: "ru", // Язык по умолчанию, если выбранный язык отсутствует
    debug: true, // Включить логирование для отладки
    lng: "ru", // Язык по умолчанию
    interpolation: {
      escapeValue: false, // React сам экранирует, поэтому отключаем
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Путь для загрузки файлов с переводами
    },
  });

export default i18n;
