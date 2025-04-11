import { ChangeEventHandler } from "react";
import { useTranslation } from "react-i18next";

import languages from "@/constants/languages";

import styles from "./LanguageSelect.module.css";

const LanguageSelect = () => {
  const { i18n } = useTranslation();

  const onSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <>
      <select
        className={styles.languageSelect}
        onChange={onSelect}
        value={i18n.language}
      >
        {languages.map(({ name, locale }) => (
          <option key={locale} value={locale}>
            {name}
          </option>
        ))}
      </select>
    </>
  );
};

export default LanguageSelect;
