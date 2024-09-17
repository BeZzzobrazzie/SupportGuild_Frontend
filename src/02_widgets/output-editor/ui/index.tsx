import { useCallback, useEffect, useState } from "react";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $parseSerializedNode,
  createCommand,
  EditorState,
  FORMAT_TEXT_COMMAND,
  LexicalCommand,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  SELECTION_CHANGE_COMMAND,
  KEY_ENTER_COMMAND,
} from "lexical";
import { mergeRegister } from "@lexical/utils";

import classes from "./style.module.css";
import { useOutputEditor } from "../lib/context";
import { EnterKeyPlugin } from "src/05_shared/lexical-plugins/enter-key-plugin";

const theme = {};

function onError(error: Error) {
  console.log(error);
}

export function OutputEditor() {
  const initialConfig = {
    namespace: "OutputEditor",
    theme,
    onError,
  };

  const [editorState, setEditorState] = useState<EditorState>();
  function onChange(editorState: EditorState) {
    setEditorState(editorState);
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={classes["editor-container"]}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <OnChangePlugin onChange={onChange} />
        <EnterKeyPlugin />
        <EditorInitializer />
      </div>
    </LexicalComposer>
  );
}

const EditorInitializer = () => {
  const [editor] = useLexicalComposerContext();
  const { setEditor } = useOutputEditor();

  useEffect(() => {
    if (editor) {
      setEditor(editor); // Сохраняем инстанс редактора в контекст
    }
  }, [editor, setEditor]);

  return null;
};

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);

  const isEditable = editor.isEditable();

  function handleClickEdit() {
    editor.setEditable(!isEditable);
  }
  function handleClickClear() {
    editor.update(() => {
      const root = $getRoot();
      root.clear();
    });
  }
  function handleClickCopyToClipboard() {}

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        1
      )
      // editor.registerCommand(
      //   CAN_UNDO_COMMAND,
      //   (payload) => {
      //     setCanUndo(payload);
      //     return false;
      //   },
      //   LowPriority,
      // ),
      // editor.registerCommand(
      //   CAN_REDO_COMMAND,
      //   (payload) => {
      //     setCanRedo(payload);
      //     return false;
      //   },
      //   LowPriority,
      // ),
    );
  }, [editor, $updateToolbar]);

  return (
    <div>
      <button onClick={handleClickEdit}>Toggle editable</button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      >
        Bold
      </button>
      <button onClick={handleClickClear}>Clear</button>
      <button onClick={handleClickCopyToClipboard}>Copy to clipboard</button>
    </div>
  );
}
