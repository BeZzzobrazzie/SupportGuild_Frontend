import {
  $getTextContent,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  ElementNode,
  LexicalCommand,
  LexicalNode,
  ParagraphNode,
  SerializedLexicalNode,
} from "lexical";

import React, { useEffect } from "react";
import {
  LexicalEditor,
  createCommand,
  $getSelection,
  $isRangeSelection,
  RangeSelection,
  $getRoot,
  $createTextNode,
  $createParagraphNode,
  $isElementNode,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { v4 as uuidv4 } from "uuid";

export class CustomListItemNode extends ElementNode {
  static getType(): string {
    return "custom-list-item";
  }

  static clone(node: CustomListItemNode): CustomListItemNode {
    return new CustomListItemNode(node.__key);
  }

  createDOM(): HTMLElement {
    // Define the DOM element here
    const dom = document.createElement("div");
    dom.classList.add("custom-list-item");
    return dom;
  }

  updateDOM(prevNode: CustomListItemNode, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return false;
  }
}

export class CustomListNode extends ElementNode {
  static getType(): string {
    return "custom-list";
  }

  static clone(node: CustomListNode): CustomListNode {
    return new CustomListNode(node.__key);
  }

  createDOM(): HTMLElement {
    // Define the DOM element here
    const dom = document.createElement("div");
    dom.classList.add("custom-list");
    return dom;
  }

  updateDOM(prevNode: CustomListNode, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return false;
  }
}

export const TOGGLE_CUSTOM_BULLET_LIST_COMMAND: LexicalCommand<undefined> =
  createCommand();

export default function CustomListPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([CustomListNode])) {
      throw new Error(
        "CustomListPlugin: CustomListNode not registered on editor (initialConfig.nodes)"
      );
    }

    return editor.registerCommand<string>(
      TOGGLE_CUSTOM_BULLET_LIST_COMMAND,
      (payload) => {
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            const listNode = new CustomListNode();
            const nodes = selection
              .getNodes()

            selection.insertNodes([listNode]);
            console.log(nodes)
            nodes.forEach((node) => {
              // console.log(node)
              const textContent = node.getTextContent();
              console.log(textContent)
              if (node.getType() === "paragraph") {
                
                // console.log(textContent)
                const listItemNode = new CustomListItemNode();
                listItemNode.append($createTextNode(`- ${node.getTextContent()}`));
                listNode.append(listItemNode);
              }
            });

            // // Создаем массив узлов один раз
            // const nodes = selection.getNodes().filter((node) => node.getTextContent());

            // nodes.forEach((node) => {
            //   const textContent = node.getTextContent();
            //   if (textContent) {
            //     const listItemNode = new CustomListItemNode();
            //     listItemNode.append($createTextNode(`- ${textContent}`));
            //     listNode.append(listItemNode);
            //   }
            // });

            // Удаляем узлы и добавляем новый список в одном вызове
            // selection.insertNodes([listNode]);
          }
        });

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}

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
