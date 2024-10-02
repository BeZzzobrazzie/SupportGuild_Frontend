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
  $getRoot,
  $getSelection,
  $isRangeSelection,
  EditorState,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  CLEAR_EDITOR_COMMAND,
} from "lexical";
import { mergeRegister } from "@lexical/utils";

import classes from "./style.module.css";
import { useOutputEditor } from "../lib/context";
import { EnterKeyPlugin } from "src/05_shared/lexical-plugins/enter-key-plugin";
import TreeViewPlugin from "src/05_shared/lexical-plugins/tree-view-plugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { MATCHERS } from "src/05_shared/lexical-plugins/auto-link-matcher";
import { AutoLinkNode } from "@lexical/link";
import { $generateHtmlFromNodes } from "@lexical/html";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@lexical/list";

const theme = {
  paragraph: classes["editor-paragraph"],
};

function onError(error: Error) {
  console.log(error);
}

export function OutputEditor() {
  const initialConfig = {
    namespace: "OutputEditor",
    theme,
    onError,
    nodes: [AutoLinkNode, ListNode, ListItemNode],
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
          contentEditable={
            <ContentEditable className={classes["editor-content"]} />
          }
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <OnChangePlugin onChange={onChange} />
        <AutoLinkPlugin matchers={MATCHERS} />
        <ListPlugin />
        <ClearEditorPlugin />

        {/* <EnterKeyPlugin /> */}
        {false && <TreeViewPlugin />}

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

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  number: "Numbered List",
  check: "Check List",
  paragraph: "Normal",
};

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);

  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const formatList = (listType: "bullet" | "number" | "check") => {
    console.log(blockType);
    if (listType === "number" && blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      setBlockType("number");
    } else if (listType === "bullet" && blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      setBlockType("bullet");
    } else if (listType === "check" && blockType !== "check") {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
      setBlockType("check");
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      setBlockType("paragraph");
    }
  };

  const isEditable = editor.isEditable();

  function handleClickEdit() {
    editor.setEditable(!isEditable);
  }
  function handleClickClear() {
    // editor.update(() => {
    //   const root = $getRoot();
    //   root.clear();
    // });

    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
  }
  function handleClickCopyToClipboard() {
    editor.update(() => {
      const htmlString = $generateHtmlFromNodes(editor);
      const html = new Blob([htmlString], { type: "text/html" });
      const text = new Blob([$getRoot().getTextContent()], {
        type: "text/plain",
      });
      const item = new ClipboardItem({ "text/plain": text, "text/html": html });
      navigator.clipboard.write([item]);
    });
  }

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
      <button
        disabled={false}
        className={"toolbar-item spaced"}
        onClick={() => formatList("bullet")}
      >
        <span className="text">Bullet List</span>
      </button>
      <button
        disabled={false}
        className={"toolbar-item spaced"}
        onClick={() => formatList("number")}
      >
        <span className="text">Numbered List</span>
      </button>
      {/* <button
        disabled={false}
        className={"toolbar-item spaced"}
        onClick={() => formatList("check")}
      >
        <span className="text">Check List</span>
      </button> */}
      <button onClick={handleClickClear}>Clear</button>
      <button onClick={handleClickCopyToClipboard}>Copy to clipboard</button>
    </div>
  );
}
