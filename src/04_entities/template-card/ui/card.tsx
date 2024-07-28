import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { templateCardIdType } from "src/05_shared/api/template-cards/types";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import {
  resetEditing,
  startEditing,
  templateCardsSlice,
  updateCard,
} from "../model";
import { RemoveCard } from "./remove-card";
import Link from "@tiptap/extension-link";
import { ModalUnsavedChanges } from "./modal-unsaved-changes";
import { explorerSlice } from "src/04_entities/explorer/model";

interface cardProps {
  id: templateCardIdType;
}

export function Card({ id }: cardProps) {
  const dispatch = useAppDispatch();
  const card = useAppSelector((state) =>
    templateCardsSlice.selectors.selectCard(state, id)
  );
  const idEditingCard = useAppSelector((state) =>
    templateCardsSlice.selectors.selectIdEditingCard(state)
  );
  const isUnsavedChanges = useAppSelector((state) =>
    templateCardsSlice.selectors.selectIsUnsavedChanges(state, id)
  );
  const isEditing = idEditingCard === id;

  const content = card?.content;
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content,
    editable: isEditing,
  });

  if (!editor || !card) {
    return <>Error</>;
  }

  const dataForUpdate = {
    ...card,
    content: editor.getText(),
  };
  const isCollectionInQueue = useAppSelector((state) =>
    explorerSlice.selectors.selectIsCollectionInQueue(state, card.parentId)
  );

  // console.log('idEditingCard: ' + idEditingCard)
  // console.log('isUnsavedChanges: ' + isUnsavedChanges)
  // console.log('isCollectionInQueue: ' + isCollectionInQueue)
  // console.log(idEditingCard && (isUnsavedChanges || isCollectionInQueue));

  // const openModal = () =>
  //   modals.openConfirmModal({
  //     title: "Unsaved Changes Detected",
  //     children: (
  //       <div>
  //         You have unsaved changes in the current template. Would you like to
  //         save your changes before editing a new template?
  //       </div>
  //     ),
  //     labels: { confirm: "Save Changes", cancel: "Discard Changes" },
  //     onCancel: () => handleClickReset(),
  //     onConfirm: () => handleClickSave(),
  //   });

  function handleClickEdit() {
    // if (idEditingCard !== null) {
    //   console.log("modal");
    //   openModal();
    // }
    dispatch(startEditing(id));
  }
  function handleClickSave() {
    dispatch(updateCard(dataForUpdate));
  }
  function handleClickReset() {
    dispatch(resetEditing());
    if (content) {
      editor?.commands.setContent(content);
    } else {
      editor?.commands.setContent("");
    }
  }

  // useEffect(() => {
  //   if (isUnsavedChanges) {
  //     // openModal();
  //   }
  // }, [isUnsavedChanges]);
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
            <RichTextEditor.Toolbar>
              {/* <span>Name: {card.name}</span> */}

              <RichTextEditor.ControlsGroup>
                {isEditing ? (
                  <>
                    <button onClick={handleClickSave}>Save</button>
                    <button onClick={handleClickReset}>Reset</button>
                  </>
                ) : (
                  <button onClick={handleClickEdit}>Edit</button>
                )}

                <RemoveCard id={card.id} />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
          </RichTextEditor>
        </div>
        {idEditingCard === card.id &&
          (isUnsavedChanges || isCollectionInQueue) && (
            <ModalUnsavedChanges
              dataForUpdate={dataForUpdate}
              content={content}
              editor={editor}
              cardId={id}
              isCollectionInQueue={isCollectionInQueue}
            />
          )}
      </>
    );
  }

  return componentContent;
}
