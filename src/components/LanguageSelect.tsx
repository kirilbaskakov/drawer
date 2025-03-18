import { useTranslation } from "react-i18next";
import languages from "../constants/languages";
import { ChangeEventHandler } from "react";

const LanguageSelect = () => {
  const { t, i18n } = useTranslation();

  const onSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <>
      <label>{t("language")}</label>
      <select
        className="language-select"
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
