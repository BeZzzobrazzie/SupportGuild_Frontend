import { RichTextEditor } from "@mantine/tiptap";
import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

import Link from "@tiptap/extension-link";
import { explorerSlice } from "src/04_entities/explorer/model";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTemplateCards } from "../api/template-cards-api";
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

interface cardProps {
  id: templateCardId;
  card: templateCard;
}

export function Card({ id, card }: cardProps) {
  const dispatch = useAppDispatch();

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

  const content = card.content || "";
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content,
    editable: isEditing,
  });

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
      { ...card, content: editor?.getText() || "" },
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
    if (content) {
      editor?.commands.setContent(content);
    } else {
      editor?.commands.setContent("");
    }
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
    console.log('copyOne')
    dispatch(copyOne(card.id))
  }

  useEffect(() => {
    if (!editor) {
      return undefined;
    }

    editor.setEditable(isEditing);
  }, [editor, isEditing]);

  let componentContent = <></>;
  if (card) {
    componentContent = (
      <>
        <div>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar className={classes["toolbar"]}>
              {/* <span>Name: {card.name}</span> */}

              <RichTextEditor.ControlsGroup>
                {isSelectedMode && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleChecked}
                  />
                )}
                {isEditing ? (
                  <>
                    <RichTextEditor.Control
                      onClick={handleClickSave}
                      aria-label="Save"
                      title="Save"
                    >
                      <ThemeIcon variant="light">
                        <IconCheckbox />
                      </ThemeIcon>
                    </RichTextEditor.Control>
                    <RichTextEditor.Control>
                      <Tooltip label="Reset" openDelay={500}>
                        <ThemeIcon variant="light" onClick={handleClickReset}>
                          <IconArrowBackUp />
                        </ThemeIcon>
                      </Tooltip>
                    </RichTextEditor.Control>
                  </>
                ) : (
                  isReadMode && (
                    <>
                      <ThemeIcon variant="light" onClick={handleClickEdit}>
                        <IconEdit />
                      </ThemeIcon>
                      <button onClick={handleClickSelect}>Select</button>
                      <button onClick={handleClickCopy}>Copy</button>
                    </>
                  )
                )}
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                {isReadMode && (
                  <ThemeIcon variant="light" onClick={handleClickRemove}>
                    <IconX />
                  </ThemeIcon>
                )}
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
          </RichTextEditor>
        </div>
        {isEditing && isUnsavedChanges && (
          // || isCollectionInQueue
          <ModalUnsavedChanges
            // dataForUpdate={dataForUpdate}
            content={content}
            editor={editor}
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
