import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import {
  copySelected,
  resetSelected,
  selectedModeOff,
  selectedModeOn,
  selectSelectedIds,
  templateCardsSlice,
} from "../model";
import {
  useAddMutation,
  usePasteMutation,
  useRemoveMutation,
} from "../lib/mutations";
import { selectAllThunk } from "../model/select-all-thunk";
import { explorerSlice } from "src/04_entities/explorer/model";

import classes from "./command-panel.module.css";
import { ActionIcon, Badge, Button, Tooltip, Text } from "@mantine/core";
import {
  IconArrowBackUp,
  IconCheckbox,
  IconClipboard,
  IconClipboardCopy,
  IconListCheck,
  IconSquare,
  IconSquarePlus,
  IconTrash,
} from "@tabler/icons-react";

export function CommandPanel() {
  const dispatch = useAppDispatch();
  // const isSelectedMode = useAppSelector((state) =>
  //   templateCardsSlice.selectors.selectIsSelectedMode(state)
  // );
  const mode = useAppSelector((state) =>
    templateCardsSlice.selectors.selectMode(state)
  );
  const isReadMode = mode === "read";
  const isEditMode = mode === "edit";
  const isSelectedMode = mode === "select";
  const amountSelected = useAppSelector((state) =>
    templateCardsSlice.selectors.selectAmountSelected(state)
  );
  // const selectedIds = useAppSelector((state) =>
  //   templateCardsSlice.selectors.selectSelectedIds(state)
  // );
  const selectedIds = useAppSelector((state) => selectSelectedIds(state));
  const activeCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectActiveCollection(state)
  );
  const copiedIds = useAppSelector((state) =>
    templateCardsSlice.selectors.selectCopiedIds(state)
  );

  const removeMutation = useRemoveMutation();
  const pasteMutation = usePasteMutation();
  const addMutation = useAddMutation();

  function handleClickSelect() {
    dispatch(selectedModeOn());
  }
  function handleClickResetSelection() {
    dispatch(resetSelected());
  }
  function handleClickDelete() {
    removeMutation.mutate(selectedIds, {
      onSuccess: () => {
        dispatch(resetSelected());
        dispatch(selectedModeOff());
      },
    });
  }
  function handleClickSelectAll() {
    dispatch(selectAllThunk());
  }
  function handleClickSelectOff() {
    dispatch(selectedModeOff());
    dispatch(resetSelected());
  }

  function handleClickCopy() {
    dispatch(copySelected());
    dispatch(resetSelected());
    dispatch(selectedModeOff());
  }

  function handleClickPaste() {
    if (activeCollection !== null) {
      pasteMutation.mutate({ parentId: activeCollection, ids: copiedIds });
    }
  }
  function handleClickAdd() {
    // dispatch(addCard(activeCollection));
    addMutation.mutate({ parentId: activeCollection });
  }

  return (
    <>
      <div className={classes["command-panel"]}>
        {isSelectedMode ? (
          <>
            {/* <Badge variant="default" color="blue" radius="sm">
              Selected: {amountSelected}
            </Badge> */}
            <ActionIcon.Group>
              <Tooltip label={"Number of selected"}>
                <ActionIcon
                  variant="default"
                  size={36}
                  data-disabled
                  className={classes["amount-selected"]}
                  onClick={(event) => event.preventDefault()}
                >
                  <Text fw={600}>{amountSelected}</Text>
                </ActionIcon>
              </Tooltip>
              <Tooltip label={"Select all"}>
                <ActionIcon
                  onClick={handleClickSelectAll}
                  variant="default"
                  size={36}
                >
                  <IconCheckbox />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={"Deselect"}>
                <ActionIcon
                  onClick={handleClickResetSelection}
                  variant="default"
                  size={36}
                >
                  <IconSquare />
                </ActionIcon>
              </Tooltip>
            </ActionIcon.Group>

            <Button.Group>
              <Button
                leftSection={<IconClipboardCopy />}
                size="sm"
                variant="default"
                onClick={handleClickCopy}
              >
                Copy
              </Button>
              <Button
                leftSection={<IconTrash />}
                size="sm"
                variant="default"
                onClick={handleClickDelete}
              >
                Delete
              </Button>
            </Button.Group>

            {/* <Tooltip label={"Delete selected"}>
              <ActionIcon onClick={handleClickDelete} variant="default">
                <IconTrash />
              </ActionIcon>
            </Tooltip> */}
            <Tooltip label={"Turn off select mode"}>
              <ActionIcon
                onClick={handleClickSelectOff}
                variant="default"
                size={36}
              >
                <IconArrowBackUp />
              </ActionIcon>
            </Tooltip>
            {/* <span>{amountSelected} selected</span> */}
            {/* <button onClick={handleClickSelectOff}>Turn off select mode</button> */}
            {/* <button onClick={handleClickResetSelection}>Deselect</button> */}
            {/* <button onClick={handleClickDelete}>Delete selected</button> */}
            {/* <button onClick={handleClickSelectAll}>Select all</button> */}
            {/* <button onClick={handleClickCopy}>Copy selected</button> */}
          </>
        ) : (
          isReadMode && (
            <>
              {/* <Tooltip label={'Add new card'}>
                <ActionIcon onClick={handleClickAdd}>
                  <IconSquarePlus />
                </ActionIcon>
              </Tooltip> */}
              {/* <Tooltip label={'Select mode'}>
                <ActionIcon onClick={handleClickSelect}>
                  <IconListCheck />
                </ActionIcon>
              </Tooltip> */}

              <Button.Group>
                <Button
                  leftSection={<IconSquarePlus />}
                  size="sm"
                  variant="default"
                  onClick={handleClickAdd}
                >
                  Create
                </Button>
                <Button
                  leftSection={<IconListCheck />}
                  size="sm"
                  variant="default"
                  onClick={handleClickSelect}
                >
                  Select
                </Button>
                <Button
                  leftSection={<IconClipboard />}
                  size="sm"
                  variant="default"
                  onClick={handleClickPaste}
                >
                  Paste
                </Button>
              </Button.Group>

              {/* <button onClick={handleClickAdd}>Add new card</button> */}
              {/* <button onClick={handleClickSelect}>Select</button> */}
              {/* <button onClick={handleClickPaste}>Paste</button> */}
            </>
          )
        )}
      </div>
    </>
  );
}
