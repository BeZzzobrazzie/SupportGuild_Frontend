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
  EditorState,
  LexicalNode,
  LineBreakNode,
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

interface cardProps {
  id: templateCardId;
  card: templateCard;
}

const theme = {};

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
        <EnterKeyPlugin />
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

          // Преобразуем сериализованные узлы в объекты узлов Lexical
          const nodesToInsert = parsedNodes.map((serializedNode) => {
              if (serializedNode.type === 'linebreak') {
                  // Явное создание LineBreakNode для переносов строк
                  return $createLineBreakNode();
              }

              return $parseSerializedNode(serializedNode);
          });

          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
              // Вставляем узлы на место курсора
              nodesToInsert.forEach((node) => {
                  selection.insertNodes([node]);

                  // Проверяем, является ли узел LineBreakNode, и вставляем его корректно
                  if (node instanceof LineBreakNode) {
                      selection.insertNodes([$createLineBreakNode()]);
                  }
                  selection.insertNodes([$createLineBreakNode()]);

              });
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

  }

  function handleClickInfo() {
    editor.read(() => {
      const editorStateJSON = editor.getEditorState().toJSON();
      console.log(editorStateJSON);
      // const root = $getRoot();
      // console.log(root.getChildren());
    })

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
            <button onClick={handleClickCopyToClipboard}>Copy to clipboard</button>
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
