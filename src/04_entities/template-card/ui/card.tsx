import { useCallback, useContext, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "src/05_shared/redux";

import { moveTemplateCardData, templateCard, templateCardDataFromServer, templateCardId } from "../api/types";
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
  IconClipboardCopy,
  IconCopy,
  IconDots,
  IconEdit,
  IconFileX,
  IconOutbound,
  IconSquareRoundedX,
  IconTrash,
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
import { MATCHERS } from "src/05_shared/lexical-plugins/auto-link-matcher";
import { ActionIcon, Menu, rem, Tooltip } from "@mantine/core";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "src/05_shared/dnd";
import cn from "classnames/bind";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "src/05_shared/api";
import { TEMPLATE_CARDS_QUERY_KEY } from "src/05_shared/query-key";
import { moveTemplateCard } from "../api/template-cards-api";


const cx = cn.bind(classes);

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

  const [collected, drag] = useDrag(() => ({
    type: ItemTypes.TEMPLATE_DIVIDER,
    item: { movedCardId: id },
    // collect: (monitor) => ({
    //   isDragging: !!monitor.isDragging(),
    // }),
  })) 

  return (<>
    <LexicalComposer initialConfig={initialConfig} >
      <div className={classes["editor-container"]} ref={drag}>
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
      <Divider cardId={id}/>
    </>
  );
}

function Divider({cardId} : {cardId: templateCardId}) {

  const moveMutation = useMutation({
    mutationFn: async (data: moveTemplateCardData) =>
      await moveTemplateCard(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({queryKey: [TEMPLATE_CARDS_QUERY_KEY]});

      const previousData = queryClient.getQueryData([TEMPLATE_CARDS_QUERY_KEY]);

      queryClient.setQueryData([TEMPLATE_CARDS_QUERY_KEY], (oldData: templateCardDataFromServer) => {
        const movedCard = oldData.byId[newData.movedCardId];
        const movedCardPrev = movedCard.prevCardId ? oldData.byId[movedCard.prevCardId] : null;
        const movedCardNext = movedCard.prevCardId ? oldData.byId[movedCard.prevCardId] : null;

        const targetCard = oldData.byId[newData.targetCardId];
        // const targetCardPrev = targetCard.prevCardId ? oldData.byId[targetCard.prevCardId] : null;
        const targetCardNext = targetCard.prevCardId ? oldData.byId[targetCard.prevCardId] : null;


        if (movedCardPrev) {
          movedCardPrev.nextCardId = movedCardNext ? movedCardNext.id : null;
        }
        if (movedCardNext) {
          movedCardNext.prevCardId = movedCardPrev ? movedCardPrev.id : null;
        }

        if (targetCard) {
          targetCard.nextCardId = movedCard.id;
        }
        if (targetCardNext) {
          targetCardNext.prevCardId = movedCard.id;
        }

        movedCard.prevCardId = targetCard.id;
        movedCard.nextCardId = targetCardNext ? targetCardNext.id : null;

        return {
          ...oldData,
          byId: {
            ...oldData.byId,
            [newData.movedCardId]: movedCard,
            ...(movedCardPrev && { [movedCardPrev.id]: movedCardPrev }),
            ...(movedCardNext && { [movedCardNext.id]: movedCardNext }),
            [targetCard.id]: targetCard,
            ...(targetCardNext && { [targetCardNext.id]: targetCardNext }),
          },
        };
      });

      return {previousData};
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData([TEMPLATE_CARDS_QUERY_KEY], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [TEMPLATE_CARDS_QUERY_KEY]});
    },  
  })

  const [{isOver}, drop] = useDrop(
    () => ({
      accept: ItemTypes.TEMPLATE_DIVIDER,
      
      drop: (item: {movedCardId: number}) => {
        console.log("dnd");
        console.log(item)
        console.log(cardId)
        moveMutation.mutate({
          movedCardId: item.movedCardId,
          targetCardId: cardId
        })
        // console.log(item);
        // moveMutation.mutate({
        //   parentId: explorerItem.id,
        //   ids: item.ids,
        // });
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  const dividerClass = cx("divider", {
    ["divider_drop"]: isOver,
  });

  return <div className={dividerClass} ref={drop}></div>
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
      <div className={classes["command-group"]}>
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
            {/* <button onClick={handleClickEdit}>Edit</button> */}
            {/* <button onClick={handleClickSelect}>Select</button> */}
            {/* <button onClick={handleClickCopy}>Copy</button> */}
            {/* <button onClick={handleClickAdd}>Add</button> */}
            {/* <button onClick={handleClickCopyToClipboard}>
              Copy to clipboard
            </button> */}
            {/* <button onClick={handleClickInfo}>Info</button> */}

            <Tooltip label="Add to output editor">
              <ActionIcon variant="default" onClick={handleClickAdd}>
                <IconOutbound />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Copy to clipboard">
              <ActionIcon
                variant="default"
                onClick={handleClickCopyToClipboard}
              >
                <IconCopy />
              </ActionIcon>
            </Tooltip>
          </>
        )}
      </div>

      <div className={classes["command-group"]}>
        {/* {isReadMode && <button onClick={handleClickRemove}>Delete</button>} */}

        {isReadMode && (
          <Menu>
            <Menu.Target>
              <ActionIcon variant="default">
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Card actions</Menu.Label>
              <Menu.Item
                onClick={handleClickEdit}
                leftSection={
                  <IconEdit style={{ width: rem(16), height: rem(16) }} />
                }
              >
                Edit
              </Menu.Item>
              <Menu.Item
                onClick={handleClickSelect}
                leftSection={
                  <IconCheckbox style={{ width: rem(16), height: rem(16) }} />
                }
              >
                Select
              </Menu.Item>
              <Menu.Item
                onClick={handleClickCopy}
                leftSection={
                  <IconClipboardCopy
                    style={{ width: rem(16), height: rem(16) }}
                  />
                }
              >
                Copy card
              </Menu.Item>
              <Menu.Item
                disabled
                // onClick={}
                // leftSection={
                //   <IconClipboardCopy
                //     style={{ width: rem(16), height: rem(16) }}
                //   />
                // }
              >
                Move
              </Menu.Item>
              <Menu.Divider />
              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item
                onClick={handleClickRemove}
                color="red"
                leftSection={
                  <IconTrash style={{ width: rem(16), height: rem(16) }} />
                }
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </div>
  );
}
