import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "src/05_shared/redux";

import { useMoveMutation } from "../api/mutations";
import { templateCard, templateCardId } from "../api/types";
import { templateCardsSlice } from "../model";

import { AutoLinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import cn from "classnames/bind";
import { EditorState } from "lexical";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "src/05_shared/dnd";
import { MATCHERS } from "src/05_shared/lexical-plugins/auto-link-matcher";
import { useCardEditor } from "../lib/context";
import classes from "./card.module.css";
import { ToolbarCardPlugin } from "./toolbar-plugin";
import { Divider } from "./divider";
import { TEMPLATE_CARD } from "../lib/dnd-const";

const cx = cn.bind(classes);

interface cardProps {
  id: templateCardId;
  card: templateCard;
}

const theme = {
  paragraph: classes["editor-paragraph"],
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: classes["editor-list-ol"],
    ul: classes["editor-list-ul"],
    listitem: "editor-listItem",
    listitemChecked: "editor-listItemChecked",
    listitemUnchecked: "editor-listItemUnchecked",
  },
};
function onError(error: Error) {
  console.log(error);
}
export function Card({ id, card }: cardProps) {
  const dispatch = useAppDispatch();

  const mode = useAppSelector((state) =>
    templateCardsSlice.selectors.selectMode(state)
  );
  const isReadMode = mode === "read";
  const isEditing = useAppSelector(
    (state) => templateCardsSlice.selectors.selectIdEditingCard(state) === id
  );

  const initialConfig = {
    namespace: "CardEditor_" + id,
    theme,
    onError,
    editable: false,
    editorState: card.content,
    nodes: [AutoLinkNode, ListNode, ListItemNode],
  };

  const [editorState, setEditorState] = useState<EditorState>();
  function onChange(editorState: EditorState) {
    setEditorState(editorState);
  }

  const [collected, drag] = useDrag(
    () => ({
      type: TEMPLATE_CARD,
      item: { movedCard: card },
      canDrag: () => {
        return isReadMode;
      },
      // collect: (monitor) => ({
      //   isDragging: !!monitor.isDragging(),
      // }),
    }),
    [isReadMode]
  );

  function handleKeyDown() {
    console.log("keydown");
  }

  return (
    <>
      {card.prevCardId === null && <Divider card={card} reverse />}
      <LexicalComposer initialConfig={initialConfig}>
        <div
          className={classes["editor-container"]}
          ref={isReadMode ? drag : null}
        >
          <ToolbarCardPlugin id={id} card={card} />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={classes["editor-content"]}
                onKeyDown={handleKeyDown}
              />
            }
            placeholder={<div>Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <OnChangePlugin onChange={onChange} />
          <AutoLinkPlugin matchers={MATCHERS} />
          <ListPlugin />
          {/* <EnterKeyPlugin /> */}
          <EditorInitializer isEditing={isEditing} />
        </div>
      </LexicalComposer>
      <Divider card={card} />
    </>
  );
}

const EditorInitializer = ({ isEditing }: { isEditing: boolean }) => {
  const [editor] = useLexicalComposerContext();
  const { setEditor } = useCardEditor();

  useEffect(() => {
    if (editor && isEditing) {
      setEditor(editor); // Сохраняем инстанс редактора в контекст
    }
  }, [editor, setEditor, isEditing]);

  return null;
};
