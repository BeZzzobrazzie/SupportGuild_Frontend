import { ActionIcon, Tooltip } from "@mantine/core";
import { IconLinkPlus } from "@tabler/icons-react";
import {
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  LexicalEditor,
  TextNode,
} from "lexical";
import { useTranslation } from "react-i18next";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { $createLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useCallback, useEffect, useRef, useState } from "react";

export function LinkActionIcon({ editor }: { editor: LexicalEditor | null }) {
  const { t, i18n } = useTranslation();

  // async function handleClick() {
  //   const value = await navigator.clipboard.readText()
  //   console.log(value)
  // }

  // async function handleClick() {
  //   try {
  //     // Чтение текста из буфера обмена (Clipboard API)
  //     const clipboardContent = await navigator.clipboard.readText();

  //     if (isUrl(clipboardContent)) {
  //       // Вставляем ссылку в Lexical редактор
  //       editor?.update(() => {
  //         const linkNode = $createLinkNode(clipboardContent);
  //         $insertNodes([linkNode]);
  //       });
  //     } else {
  //       console.log('Clipboard content is not a URL:', clipboardContent);
  //     }
  //   } catch (error) {
  //     // Если возникает ошибка, например, из-за отсутствия разрешений
  //     console.error('Ошибка при чтении буфера обмена:', error);
  //     alert('Не удалось получить содержимое буфера обмена. Проверьте разрешения на использование буфера.');
  //   }
  // }

  // function isUrl(text: string): boolean {
  //   const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
  //   return urlPattern.test(text);
  // }

  // Функция для проверки, является ли текст URL


  const destination = document.getElementById("one");
  destination && destination.addEventListener("click", () => {
  navigator.clipboard
    .readText()
    .then((clipText) => (console.log(clipText)));
});


  return (
    <>
      <Tooltip label={t("editor.boldFont")}>
        <ActionIcon variant="default" 
        // onClick={handleClick}
        id="one"
        >
          <IconLinkPlus />
        </ActionIcon>
      </Tooltip>
    </>
  );
}

// Попробуем использовать clipboard API синхронно через Promise
// navigator.clipboard.readText()
//   .then((clipboardValue) => {
//     console.log(clipboardValue)

//     // Проверка на случай, если буфер обмена пуст или не содержит ссылку
//     // if (!clipboardValue.startsWith('http')) {
//     //   alert("Буфер обмена не содержит ссылку");
//     //   return;
//     // }

//     // // Продолжаем с обычным обновлением редактора
//     // editor && editor.update(() => {
//     //   const selection = $getSelection();

//     //   if ($isRangeSelection(selection)) {
//     //     const selectedText = selection.getTextContent();

//     //     if (selectedText.length > 0) {
//     //       // Если есть выделенный текст, оборачиваем его в ссылку
//     //       editor.dispatchCommand(TOGGLE_LINK_COMMAND, clipboardValue);
//     //     } else {
//     //       // Если текста нет, создаем ссылку и вставляем ее
//     //       const linkNode = $createLinkNode(clipboardValue);
//     //       const textNode = new TextNode(clipboardValue); // Текст ссылки
//     //       linkNode.append(textNode);
//     //       selection.insertNodes([linkNode]);
//     //     }
//     //   }
//     // });
//   })
//   .catch((error) => {
//     console.error("Ошибка при чтении буфера обмена:", error);
//     alert("Не удалось получить данные из буфера обмена");
//   });
