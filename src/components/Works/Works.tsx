import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuSearchX } from "react-icons/lu";

import useConfirm from "@/hooks/useConfirm";
import deleteCanvas from "@/utils/storage/deleteCanvas";
import getAllCanvases from "@/utils/storage/getAllCanvases";

import SortButton, { SortValue } from "../SortButton/SortButton";
import WorkCard from "../WorkCard/WorkCard";
import styles from "./Works.module.css";

const Works = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [selectedSort, setSelectedSort] = useState<SortValue>("lastOpen");
  const { showModal } = useConfirm();
  const [canvases, setCanvases] = useState(() => getAllCanvases());

  const sortedCanvases = useMemo(() => {
    const filteredCanvases = canvases.filter(({ name }) =>
      name.toLowerCase().includes(searchText.toLowerCase()),
    );
    filteredCanvases.sort((a, b) => {
      if (a[selectedSort] < b[selectedSort]) {
        return 1;
      }
      return a[selectedSort] == b[selectedSort] ? 0 : -1;
    });
    return filteredCanvases;
  }, [canvases, searchText, selectedSort]);

  const onDelete = (id: string) => () => {
    showModal(t("deleteCanvasConfirmTitle"), t("deleteCanvasConfirmText")).then(
      (confirmed) => {
        if (!confirmed) {
          return;
        }
        deleteCanvas(id);
        setCanvases(canvases.filter((canvas) => canvas.id != id));
      },
    );
  };

  return (
    <div className={styles.works}>
      <div className={styles.worksHeading}>
        <h2 className={styles.worksTitle}>{t("yourWorks")}</h2>
        <SortButton selectedSort={selectedSort} onChange={setSelectedSort} />
      </div>
      <input
        placeholder={t("search")}
        className={styles.searchWorks}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      {sortedCanvases.length ? (
        <div className={styles.workCards}>
          {sortedCanvases.map(({ id, name, lastOpen, image }) => (
            <WorkCard
              key={id}
              id={id}
              name={name}
              image={image}
              date={new Date(lastOpen).toLocaleDateString()}
              onDelete={onDelete(id)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noWorks}>
          <LuSearchX size={50} />
          <p>{t("noWorks")}</p>
        </div>
      )}
    </div>
  );
};

export default Works;
