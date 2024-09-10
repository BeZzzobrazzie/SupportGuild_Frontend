import { RichTextEditor } from "@mantine/tiptap";
// import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useContext, useEffect, useState } from "react";

import Link from "@tiptap/extension-link";
import { explorerSlice } from "src/04_entities/explorer/model";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTemplateCards } from "../api/template-cards-api";
import { templateCard, templateCardId } from "../api/types";
import {
  addToOutputEditor,
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
import { modals } from "@mantine/modals";
import { ModalUnsavedChanges } from "./modal-unsaved-changes";
import { ThemeIcon, Tooltip } from "@mantine/core";
import {
  IconArrowBackUp,
  IconCheckbox,
  IconEdit,
  IconFileX,
  IconSquareRoundedX,
  IconX,
} from "@tabler/icons-react";

import classes from "./card.module.css";
import { Editable, Slate, useSlate, withReact } from "slate-react";
import { createEditor, Descendant, Editor, Transforms, Node } from "slate";
import { EditorContext } from "src/02_widgets/output-editor/lib/context";
import { resetNodes } from "src/05_shared/slate-reset-nodes";
import { EditorState } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

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
  };

  const [editorState, setEditorState] = useState<EditorState>();
  function onChange(editorState: EditorState) {
    setEditorState(editorState);
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={classes["editor-container"]}>
        <ToolbarCardPlugin id={id}/>
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* <HistoryPlugin /> */}
        <OnChangePlugin onChange={onChange} />
      </div>
    </LexicalComposer>
  );
}

function ToolbarCardPlugin({id}: {id: templateCardId}) {
  const dispatch = useAppDispatch();
  const [editor] = useLexicalComposerContext();

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
  }


  return (
    <div className={classes.toolbar}>
      <div>
        {isSelectedMode && (
          <input
            type="checkbox"
            // checked={isSelected} onChange={handleChecked}
          />
        )}
        {isEditing && (
          <>
            <button>Save</button>
            <button onClick={handleClickReset}>Reset</button>
          </>
        )}
        {isReadMode && (
          <>
            <button onClick={handleClickEdit}>Edit</button>
            <button>Select</button>
            <button>Copy</button>
            <button>Add</button>
          </>
        )}
      </div>

      <div>{isReadMode && <button>Delete</button>}</div>
    </div>
  );
}

export function CardQ({ id, card }: cardProps) {
  const dispatch = useAppDispatch();
  const [editor] = useState(() => withReact(createEditor()));

  const content = card.content;
  const initialValue: Descendant[] = content || [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ];
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const handleChange = useCallback((newValue: Descendant[]) => {
    setValue(newValue);
  }, []);

  const outputEditor = useContext(EditorContext);

  const updateMutation = useUpdateMutation();
  const removeMutation = useRemoveMutation();

  // const isSelectedMode = useAppSelector((state) =>
  //   templateCardsSlice.selectors.selectIsSelectedMode(state)
  // );
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

  // const editor = useEditor({
  //   extensions: [StarterKit, Link],
  //   content,
  //   editable: isEditing,
  // });

  // const isCollectionInQueue = useAppSelector((state) =>
  //   explorerSlice.selectors.selectIsCollectionInQueue(state, card.parentId)
  // );

  function handleClickEdit() {
    if (idEditingCard !== null) {
      console.log("modal");
      // openModal();
    }
    dispatch(startEditing(id));
    dispatch(editModeOn());
  }
  function handleClickSave() {
    updateMutation.mutate(
      { ...card, content: value },
      {
        onSuccess: () => {
          dispatch(resetEditing());
          dispatch(editModeOff());
        },
      }
    );
  }
  function handleClickReset() {
    dispatch(resetEditing());
    dispatch(editModeOff());
    Editor.withoutNormalizing(editor, () => {
      editor.children = initialValue;
      editor.selection = null;
    });
    editor.onChange();
  }
  function handleClickRemove() {
    removeMutation.mutate([card.id]);
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
  function handleClickCopy() {
    console.log("copyOne");
    dispatch(copyOne(card.id));
  }

  function handleClickAddToOutputEditor() {
    console.log("add");
    if (outputEditor !== null) {
      console.log(value);

      resetNodes(outputEditor, { nodes: [...outputEditor.children, ...value] });
      // outputEditor.children = [...outputEditor.children, ...value];
      // outputEditor.onChange();
      // Transforms.insertFragment(outputEditor, value);
    }
    // dispatch(addToOutputEditor(value));
  }
  // useEffect(() => {
  //   if (!editor) {
  //     return undefined;
  //   }

  //   editor.setEditable(isEditing);
  // }, [editor, isEditing]);

  let componentContent = <></>;
  let toolbar = <></>;
  if (card) {
    toolbar = (
      <>
        <div className={classes.toolbar}>
          <div>
            {isSelectedMode && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleChecked}
              />
            )}
            {isEditing ? (
              <>
                <ThemeIcon variant="light" onClick={handleClickSave}>
                  <IconCheckbox />
                </ThemeIcon>
                <Tooltip label="Reset" openDelay={500}>
                  <ThemeIcon variant="light" onClick={handleClickReset}>
                    <IconArrowBackUp />
                  </ThemeIcon>
                </Tooltip>
              </>
            ) : (
              isReadMode && (
                <>
                  <ThemeIcon variant="light" onClick={handleClickEdit}>
                    <IconEdit />
                  </ThemeIcon>
                  <button onClick={handleClickSelect}>Select</button>
                  <button onClick={handleClickCopy}>Copy</button>
                  <button onClick={handleClickAddToOutputEditor}>Add</button>
                </>
              )
            )}
          </div>
          <div>
            {isReadMode && (
              <ThemeIcon variant="light" onClick={handleClickRemove}>
                <IconX />
              </ThemeIcon>
            )}
          </div>
        </div>
      </>
    );
    componentContent = (
      <>
        <div>
          {toolbar}
          <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={handleChange}
          >
            <Editable style={{ width: "100%" }} readOnly={!isEditing} />
          </Slate>
        </div>
        {isEditing && isUnsavedChanges && (
          // || isCollectionInQueue
          <ModalUnsavedChanges
            // dataForUpdate={dataForUpdate}
            editor={editor}
            value={value}
            content={content}
            cardId={id}
            card={card}
            // isCollectionInQueue={isCollectionInQueue}
          />
        )}
      </>
    );
  }

  return componentContent;
}

// <RichTextEditor editor={editor}>
// <RichTextEditor.Toolbar className={classes["toolbar"]}>
//   {/* <span>Name: {card.name}</span> */}

//   <RichTextEditor.ControlsGroup>
//     {isSelectedMode && (
//       <input
//         type="checkbox"
//         checked={isSelected}
//         onChange={handleChecked}
//       />
//     )}
//     {isEditing ? (
//       <>
//         <RichTextEditor.Control
//           onClick={handleClickSave}
//           aria-label="Save"
//           title="Save"
//         >
//           <ThemeIcon variant="light">
//             <IconCheckbox />
//           </ThemeIcon>
//         </RichTextEditor.Control>
//         <RichTextEditor.Control>
//           <Tooltip label="Reset" openDelay={500}>
//             <ThemeIcon variant="light" onClick={handleClickReset}>
//               <IconArrowBackUp />
//             </ThemeIcon>
//           </Tooltip>
//         </RichTextEditor.Control>
//       </>
//     ) : (
//       isReadMode && (
//         <>
//           <ThemeIcon variant="light" onClick={handleClickEdit}>
//             <IconEdit />
//           </ThemeIcon>
//           <button onClick={handleClickSelect}>Select</button>
//           <button onClick={handleClickCopy}>Copy</button>
//         </>
//       )
//     )}
//   </RichTextEditor.ControlsGroup>
//   <RichTextEditor.ControlsGroup>
//     {isReadMode && (
//       <ThemeIcon variant="light" onClick={handleClickRemove}>
//         <IconX />
//       </ThemeIcon>
//     )}
//   </RichTextEditor.ControlsGroup>
// </RichTextEditor.Toolbar>
// <RichTextEditor.Content />
// </RichTextEditor>
