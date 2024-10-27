// import { ElementNode, LexicalNode, ParagraphNode, SerializedLexicalNode } from "lexical";

// import React, { useEffect } from "react";
// import {
//   LexicalEditor,
//   createCommand,
//   $getSelection,
//   $isRangeSelection,
//   RangeSelection,
//   $getRoot,
//   $createTextNode,
//   $createParagraphNode,
//   $isElementNode,
// } from "lexical";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { v4 as uuidv4 } from 'uuid';

// export const TOGGLE_BULLET_LIST_COMMAND = createCommand();
// export const TOGGLE_NUMBERED_LIST_COMMAND = createCommand();

// const CustomListPlugin = () => {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     return editor.registerCommand(
//       TOGGLE_BULLET_LIST_COMMAND,
//       () => {
//         handleToggleList("bullet");
//         return true;
//       },
//       1
//     );
//   }, [editor]);

//   useEffect(() => {
//     return editor.registerCommand(
//       TOGGLE_NUMBERED_LIST_COMMAND,
//       () => {
//         handleToggleList("numbered");
//         return true;
//       },
//       1
//     );
//   }, [editor]);

//   const handleToggleList = (newListType: 'bullet' | 'numbered') => {
//     const selection = $getSelection();
//     if ($isRangeSelection(selection)) {
//       const nodes = selection.getNodes();
//       let shouldConvertToText = true;
  
//       // Проверяем, есть ли выделенные элементы списков
//       const listNodes = nodes.filter(node => $isElementNode(node) && node instanceof CustomListNode);
  
//       if (listNodes.length > 0) {
//         // Логика для существующих списков
//         listNodes.forEach((node) => {
//           if (node.type === newListType) {
//             shouldConvertToText = true; // Конвертируем в текст
//           } else {
//             node.type = newListType; // Меняем тип списка
//             shouldConvertToText = false;
//           }
//         });
  
//         if (shouldConvertToText) {
//           // Преобразуем в текст, если тип тот же
//           listNodes.forEach((node) => {
//             const textNodes = node.getChildren().map((child) => child.getTextContent()).join('\n');
//             const paragraphNode = $createParagraphNode().append($createTextNode(textNodes));
//             $getRoot().append(paragraphNode);
//             node.remove();
//           });
//         }
//       } else {
//         // Логика для обычных параграфов
//         const paragraphs = nodes.filter(node => $isElementNode(node) && node instanceof ParagraphNode);
//         if (paragraphs.length > 0) {
//           const listNode = new CustomListNode(uuidv4(), newListType);
//           paragraphs.forEach((node, index) => {
//             const listItemText = node.getTextContent();
//             const listItemNode = $createTextNode(newListType === 'bullet' ? `- ${listItemText}` : `${index + 1}. ${listItemText}`);
//             listNode.append(listItemNode);
//             node.remove();
//           });
//           $getRoot().append(listNode);
//         }
//       }
//     }
//   };

//   return null; // Нет рендеринга на экране
// };

// export default CustomListPlugin;

// export class CustomListNode extends ElementNode {
//   static getType() {
//     return "list";
//   }

//   static clone(node: CustomListNode) {
//     return new CustomListNode(node.__key, node.getType());
//   }

//   constructor(key: string, public type: "bullet" | "numbered") {
//     super(key);
//   }

//   createDOM() {
//     const element = document.createElement("div");
//     element.className = `list ${this.type}`;
//     return element;
//   }

//   updateDOM() {
//     return false;
//   }

//   static importJSON(serializedNode: SerializedLexicalNode) {
//     return new CustomListNode(serializedNode.key, serializedNode.type);
//   }

//   exportJSON(): SerializedLexicalNode {
//     return {
//       ...super.exportJSON(),
//       type: this.type,
//     };
//   }
// }
// function useLexicalEditorContext() {
//   throw new Error("Function not implemented.");
// }
