import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import enJSON from "../public/locales/en.json";
import ruJSON from "../public/locales/ru.json";

i18next.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    ru: { ...ruJSON },
  },
  lng: "en",
});
