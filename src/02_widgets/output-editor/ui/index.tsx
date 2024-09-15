import { RichTextEditor } from "@mantine/tiptap";
import Link from "@tiptap/extension-link";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useState } from "react";
import { BaseEditor, createEditor, Descendant } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import {
  saveOutputEditorChange,
  templateCardsSlice,
} from "src/04_entities/template-card/model";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";

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
  EditorState,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { mergeRegister } from "@lexical/utils";

import classes from "./style.module.css";
import { useOutputEditor } from "../lib/context";

// export function OutputEditor({
//   setOutputEditor,
// }: {
//   setOutputEditor: React.Dispatch<
//     React.SetStateAction<(BaseEditor & ReactEditor) | null>
//   >;
// }) {
//   const dispatch = useAppDispatch();
//   // const content = "";
//   // const editor = useEditor({
//   //   extensions: [StarterKit, Link],
//   //   content,
//   // });

//   // return (
//   //   <RichTextEditor editor={editor}>
//   //     <RichTextEditor.Content />
//   //   </RichTextEditor>
//   // );
//   const outputEditorChanged = useAppSelector(
//     (state) => state.templateCards.outputEditorChanged
//   );
//   const outputEditorContent = useAppSelector((state) =>
//     templateCardsSlice.selectors.selectOutputEditorContent(state)
//   );
//   // const initialValue: Descendant[] = [
//   //   {
//   //     type: "paragraph",
//   //     children: [{ text: "A line of text in a paragraph." }],
//   //   },
//   // ];
//   const initialValue = outputEditorContent;
//   const [value, setValue] = useState<Descendant[]>(initialValue);
//   const handleChange = useCallback((newValue: Descendant[]) => {
//     setValue(newValue);
//   }, []);

//   const [editor] = useState(() => withReact(createEditor()));

//   useEffect(() => {
//     setOutputEditor(editor);
//   }, [editor, setOutputEditor]);

//   return (
//     // Add the editable component inside the context.
//     <Slate editor={editor} initialValue={initialValue} onChange={handleChange} >
//       <Editable style={{ width: "100%" }} />
//     </Slate>
//   );
// }

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
        <InsertExternalNodesPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <OnChangePlugin onChange={onChange} />
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

  function handleClickClone() {
    editor.update(() => {
      const root = $getRoot(); // Получаем корневой узел
      const children = root.getChildren(); // Получаем дочерние узлы корня

      const one = "";
      // children.forEach((child) => {

      // })
      // root.append(children[0].constructor.clone())
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
      <button onClick={handleClickClone}>Clone</button>
    </div>
  );
}

function InsertExternalNodesPlugin() {
  const [editor] = useLexicalComposerContext();

  const onClick = () => {
    editor.update(() => {
     

      const children = $getRoot().getChildren();
      const lastNode = children[children.length - 1];

      const editorStateJSON = editor.getEditorState().toJSON();
      console.log(editorStateJSON);
      console.log(JSON.stringify(editorStateJSON));

      const parsedNodes = editorStateJSON.root.children
      const nodesToReplace = parsedNodes.map($parseSerializedNode);

      let target: LexicalNode | null = null;

      nodesToReplace.forEach((node) => {
        // const clone = $copyNode(node);
        // const clone = $copyNodeDeep(node);
        const clone = node; // no cloning

        if (target === null) {
          lastNode.insertAfter(clone);
        } else {
          target.insertAfter(clone);
        }
        target = clone;
      });

    });
  };

  return (<button onClick={onClick}>Insert</button>);
}
