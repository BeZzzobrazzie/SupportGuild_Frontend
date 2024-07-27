import { Editor } from "@tiptap/react";
import { card } from "../lib/types";
import { templateCardIdType } from "src/05_shared/api/template-cards/types";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import {
  continueEditing,
  resetEditing,
  templateCardsSlice,
  updateCard,
} from "../model";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { changeCurrentCollectionToNext, changeNextCollection } from "src/04_entities/explorer/model";

export function ModalUnsavedChanges({
  dataForUpdate,
  content,
  editor,
  cardId,
  isCollectionInQueue,
}: {
  dataForUpdate: card;
  content: string | undefined;
  editor: Editor;
  cardId: templateCardIdType;
  isCollectionInQueue: boolean;
}) {
  const dispatch = useAppDispatch();
  const isUnsavedChanges = useAppSelector((state) =>
    templateCardsSlice.selectors.selectIsUnsavedChanges(state, cardId)
  );
  const [opened, { open, close }] = useDisclosure(true, {
    onClose: () => {
      if (isUnsavedChanges) {
        dispatch(continueEditing());
      }
      if(isCollectionInQueue) {
        dispatch(changeNextCollection(null));

      }
    },
  });

  function handleClickSave() {
    dispatch(updateCard(dataForUpdate));
    if (isCollectionInQueue) {
      dispatch(changeCurrentCollectionToNext());
    }
  }
  function handleClickReset() {
    if (content) {
      editor.commands.setContent(content);
    } else {
      editor.commands.setContent("");
    }
    dispatch(resetEditing());
    if (isCollectionInQueue) {
      dispatch(changeCurrentCollectionToNext());
    }
  }

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <div>Unsaved Changes Detected</div>
        <div>
          You have unsaved changes in the current template. Would you like to
          save your changes before editing a new template?
        </div>
        <button onClick={handleClickSave}>Save Changes</button>
        <button onClick={handleClickReset}>Discard Changes</button>
      </Modal>
    </>
  );
}
