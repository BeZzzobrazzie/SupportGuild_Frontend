import { LexicalEditor } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";

interface handleClickCopyToClipboardProps {
  editor: LexicalEditor;
}
export function handleClickCopyToClipboard({
  editor,
}: handleClickCopyToClipboardProps) {
  editor.update(() => {
    const htmlString = $generateHtmlFromNodes(editor);

    const html = new Blob([htmlString], { type: "text/html" });

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    console.log(tempDiv);
    function processLists(element: HTMLElement) {
      let result = "";
      element.childNodes.forEach((node) => {
        if (node.nodeName === "UL") {
          node.childNodes.forEach((li) => {
            if (li.nodeName === "LI") {
              result += "    - " + (li as HTMLElement).innerText + "\n";
            }
          });
        } else if (node.nodeName === "OL") {
          for (let i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeName === "LI") {
              result +=
                `    ${i + 1}. ` +
                (node.childNodes[i] as HTMLElement).innerText +
                "\n";
            }
          }
        } else if (node.nodeName === "P") {
          result += (node as HTMLElement).innerText + "\n";
        } else if (node.nodeType === Node.TEXT_NODE) {
          result += node.textContent;
        } else if (node instanceof HTMLElement) {
          result += processLists(node);
        }
      });
      return result;
    }

    const plainText = processLists(tempDiv);
    const text = new Blob([plainText], { type: "text/plain" });
    const item = new ClipboardItem({ "text/plain": text, "text/html": html });
    navigator.clipboard.write([item]);
  });
}
