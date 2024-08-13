import { Editor } from "@tiptap/react";
import {
  templateCardIdType,
  templateCardType,
} from "src/04_entities/template-card/api/types";
import {
  continueEditing,
  resetEditing,
  templateCardsSlice,
  updateCard,
} from "../model";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";

export function ModalUnsavedChanges({
  dataForUpdate,
  content,
  editor,
  cardId,
  isCollectionInQueue,
}: {
  dataForUpdate: templateCardType;
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
      if (isCollectionInQueue) {
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
