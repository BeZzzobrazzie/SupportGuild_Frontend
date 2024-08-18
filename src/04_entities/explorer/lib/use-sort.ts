import { useMemo } from "react";
import { explorerItem } from "../api/types";

export function useSort(children: explorerItem[]) {
  return useMemo(
    () =>
      children.sort((a, b) => {
        // Сначала сравниваем категории
        if (a.category === "folder" && b.category === "file") {
          return -1; // a идет перед b
        } else if (a.category === "file" && b.category === "folder") {
          return 1; // b идет перед a
        }

        // Проверяем, является ли первое имя латиницей
        const isALatin = /^[A-Za-z]/.test(a.name);
        const isBLatin = /^[A-Za-z]/.test(b.name);

        // Если a латиница, а b нет, то a идет перед b
        if (isALatin && !isBLatin) {
          return -1;
        }

        // Если b латиница, а a нет, то b идет перед a
        if (!isALatin && isBLatin) {
          return 1;
        }

        // Если обе строки либо обе латиница, либо обе кириллица, сортируем по имени
        return a.name.localeCompare(b.name);
      }),
    [children]
  );
}
