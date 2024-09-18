import { useCallback, useContext, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "src/05_shared/redux";

import { templateCard, templateCardId } from "../api/types";
import {
  addToSelected,
  copyOne,
  editModeOff,
  editModeOn,
  removeFromSelected,
  resetEditing,
  selectedModeOn,
  startEditing,
  templateCardsSlice,
} from "../model";
import { useRemoveMutation, useUpdateMutation } from "../lib/mutations";
import {
  IconArrowBackUp,
  IconCheckbox,
  IconEdit,
  IconFileX,
  IconSquareRoundedX,
  IconX,
} from "@tabler/icons-react";

import classes from "./card.module.css";
import {
  $createLineBreakNode,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $parseSerializedNode,
  CONTROLLED_TEXT_INSERTION_COMMAND,
  EditorState,
  LexicalNode,
  LineBreakNode,
  SerializedEditorState,
  SerializedLexicalNode,
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useOutputEditor } from "src/02_widgets/output-editor/lib/context";
import { EnterKeyPlugin } from "src/05_shared/lexical-plugins/enter-key-plugin";
import { copyToClipboard } from "@lexical/clipboard";
import { $generateHtmlFromNodes } from "@lexical/html";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { AutoLinkNode } from "@lexical/link";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";

const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text);
    if (match === null) {
      return null;
    }
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith("http") ? fullMatch : `https://${fullMatch}`,
      // attributes: { rel: 'noreferrer', target: '_blank' }, // Optional link attributes
    };
  },
];

const htmlToRtf = (html: string) => {
  // Обертка для преобразования HTML в RTF формат
  return `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Arial;}}\\f0\\fs20 ${html.replace(
    /<[^>]+>/g,
    ""
  )}}`;
};

interface cardProps {
  id: templateCardId;
  card: templateCard;
}

const theme = {
  paragraph: classes["editor-paragraph"],
};
function onError(error: Error) {
  console.log(error);
}
export function Card({ id, card }: cardProps) {
  const dispatch = useAppDispatch();

  const initialConfig = {
    namespace: "CardEditor_" + id,
    theme,
    onError,
    editable: false,
    editorState: card.content,
    nodes: [AutoLinkNode],
  };

  const [editorState, setEditorState] = useState<EditorState>();
  function onChange(editorState: EditorState) {
    setEditorState(editorState);
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={classes["editor-container"]}>
        <ToolbarCardPlugin id={id} card={card} />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className={classes["editor-content"]} />
          }
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* <HistoryPlugin /> */}
        <OnChangePlugin onChange={onChange} />

        <AutoLinkPlugin matchers={MATCHERS} />
        {/* <EnterKeyPlugin /> */}
      </div>
    </LexicalComposer>
  );
}

function ToolbarCardPlugin({
  id,
  card,
}: {
  id: templateCardId;
  card: templateCard;
}) {
  const dispatch = useAppDispatch();
  const [editor] = useLexicalComposerContext();
  const { editor: outputEditor } = useOutputEditor();

  const isEditable = editor.isEditable();

  const mode = useAppSelector((state) =>
    templateCardsSlice.selectors.selectMode(state)
  );
  const isReadMode = mode === "read";
  const isEditMode = mode === "edit";
  const isSelectedMode = mode === "select";
  const isSelected = useAppSelector((state) =>
    templateCardsSlice.selectors.selectIsSelected(state, id)
  );
  const isUnsavedChanges = useAppSelector((state) =>
    templateCardsSlice.selectors.selectIsUnsavedChanges(state, id)
  );
  const idEditingCard = useAppSelector((state) =>
    templateCardsSlice.selectors.selectIdEditingCard(state)
  );
  const isEditing = idEditingCard === id;

  const updateMutation = useUpdateMutation();
  const removeMutation = useRemoveMutation();

  function handleClickEdit() {
    if (idEditingCard !== null) {
      console.log("modal");
      // openModal();
    }
    dispatch(startEditing(id));
    dispatch(editModeOn());
    editor.setEditable(true);
  }
  function handleClickReset() {
    dispatch(resetEditing());
    dispatch(editModeOff());
    editor.setEditable(false);
    editor.setEditorState(editor.parseEditorState(card.content));
  }

  function handleClickSave() {
    updateMutation.mutate(
      { ...card, content: JSON.stringify(editor.getEditorState().toJSON()) },
      {
        onSuccess: () => {
          dispatch(resetEditing());
          dispatch(editModeOff());
        },
      }
    );
    editor.setEditable(false);
  }

  function handleClickAdd() {
    if (outputEditor) {
      outputEditor.update(() => {
        const editorStateJSON = editor.getEditorState().toJSON();
        const parsedNodes = editorStateJSON.root.children;

        const nodesToInsert = parsedNodes.map((serializedNode) => {
          return $parseSerializedNode(serializedNode);
        });

        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          selection.removeText();
          selection.insertNodes(nodesToInsert);
        }
      });
    }
  }

  function handleChecked() {
    if (isSelected) {
      dispatch(removeFromSelected(card.id));
    } else {
      dispatch(addToSelected(card.id));
    }
  }

  function handleClickSelect() {
    dispatch(selectedModeOn());
    dispatch(addToSelected(card.id));
  }

  function handleClickRemove() {
    removeMutation.mutate([card.id]);
  }

  function handleClickCopy() {
    console.log("copyOne");
    dispatch(copyOne(card.id));
  }
  function handleClickCopyToClipboard() {
    // editor.read(() => {
    //   const markdownString = $convertToMarkdownString(TRANSFORMERS, $getRoot());
    //   const htmlString = $generateHtmlFromNodes(editor);
    //   navigator.clipboard.writeText(markdownString);
    // });

    // editor.update(() => {
    //   const root = $getRoot();
    //   const htmlContent = $generateHtmlFromNodes(editor, null);

    //   // Конвертируем HTML в RTF
    //   const rtfContent = htmlToRtf(htmlContent);

    //   // Копируем в буфер обмена
    //   navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([rtfContent], { type: 'text/html' }) })]).then(() => {
    //     console.log('Содержимое успешно скопировано в буфер обмена');
    //   }).catch(err => {
    //     console.error('Ошибка копирования в буфер обмена', err);
    //   });
    // })

    // navigator.clipboard.read().then((data) => console.log(data))

    editor.update(() => {
      // const image = await fetch("myImage.png").then((response) =>
      //   response.blob()
      // );
      const htmlString = $generateHtmlFromNodes(editor);
      const html = new Blob([htmlString], { type: "text/html" });
      // const text = new Blob(["this is alternative image text"], {
      //   type: "text/plain",
      // });
      const text = new Blob([$getRoot().getTextContent()], { type: "text/plain" });
      const item = new ClipboardItem({ "text/plain": text, "text/html": html });
      navigator.clipboard.write([item]);
    })

  }

  function handleClickInfo() {
    editor.read(() => {
      const editorStateJSON = editor.getEditorState().toJSON();
      console.log(editorStateJSON);
      // const root = $getRoot();
      // console.log(root.getChildren());
    });
  }

  return (
    <div className={classes.toolbar}>
      <div>
        {isSelectedMode && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleChecked}
          />
        )}
        {isEditing && (
          <>
            <button onClick={handleClickSave}>Save</button>
            <button onClick={handleClickReset}>Reset</button>
          </>
        )}
        {isReadMode && (
          <>
            <button onClick={handleClickEdit}>Edit</button>
            <button onClick={handleClickSelect}>Select</button>
            <button onClick={handleClickCopy}>Copy</button>
            <button onClick={handleClickAdd}>Add</button>
            <button onClick={handleClickCopyToClipboard}>
              Copy to clipboard
            </button>
            <button onClick={handleClickInfo}>Info</button>
          </>
        )}
      </div>

      <div>
        {isReadMode && <button onClick={handleClickRemove}>Delete</button>}
      </div>
    </div>
  );
}
