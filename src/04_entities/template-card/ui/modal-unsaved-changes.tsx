import { Editor } from "@tiptap/react";

import { continueEditing, resetEditing, templateCardsSlice } from "../model";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { templateCard, templateCardId } from "../api/types";
import { useUpdateMutation } from "../lib/mutations";

export function ModalUnsavedChanges({
  // dataForUpdate,
  content,
  editor,
  cardId,
  card,
}: // isCollectionInQueue,
{
  // dataForUpdate: templateCard;
  content: string | undefined;
  editor: Editor | null;
  cardId: templateCardId;
  card: templateCard;

  // isCollectionInQueue: boolean;
}) {
  const dispatch = useAppDispatch();
  const isUnsavedChanges = useAppSelector((state) =>
    templateCardsSlice.selectors.selectIsUnsavedChanges(state, cardId)
  );
  const updateMutation = useUpdateMutation();

  const [opened, { open, close }] = useDisclosure(true, {
    onClose: () => {
      if (isUnsavedChanges) {
        dispatch(continueEditing());
      }
      // if (isCollectionInQueue) {
      //   dispatch(changeNextCollection(null));
      // }
    },
  });

  function handleClickSave() {
    updateMutation.mutate(
      { ...card, content: editor?.getText() || "" },
      {
        onSuccess: () => {
          dispatch(resetEditing());
        },
      }
    );
    // dispatch(updateCard(dataForUpdate));
    // if (isCollectionInQueue) {
    //   dispatch(changeCurrentCollectionToNext());
    // }
  }
  function handleClickReset() {
    if (editor) {
      if (content) {
        editor.commands.setContent(content);
      } else {
        editor.commands.setContent("");
      }
    }

    dispatch(resetEditing());
    // if (isCollectionInQueue) {
    //   dispatch(changeCurrentCollectionToNext());
    // }
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
