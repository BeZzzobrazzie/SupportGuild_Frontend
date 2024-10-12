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
} from "../api/mutations";
import { selectAllThunk } from "../model/select-all-thunk";
import { explorerSlice } from "src/04_entities/explorer/model";

import classes from "./command-panel.module.css";
import { ActionIcon, Badge, Button, Tooltip, Text } from "@mantine/core";
import {
  IconArrowBackUp,
  IconBold,
  IconCheckbox,
  IconClipboard,
  IconClipboardCopy,
  IconListCheck,
  IconSquare,
  IconSquarePlus,
  IconTrash,
} from "@tabler/icons-react";
import { useCardEditor } from "../lib/context";
import {
  $createParagraphNode,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  RangeSelection,
} from "lexical";
import { useState } from "react";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  ListItemNode,
  ListNode,
  ListType,
} from "@lexical/list";
import { BoldActionIcon, ListActionIcon } from "src/03_features/action-icon";

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

  const { editor } = useCardEditor();
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const formatList = (listType: "bullet" | "number" | "check") => {
    // console.log(blockType);
    if (editor) {
      if (listType === "number" && blockType !== "number") {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        setBlockType("number");
      } else if (listType === "bullet" && blockType !== "bullet") {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        setBlockType("bullet");
      } else if (listType === "check" && blockType !== "check") {
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
        setBlockType("check");
      } else {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        setBlockType("paragraph");
      }
    }
  };

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
      <div className={classes["command-panel__container"]}>
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

              <Tooltip label={"Turn off select mode"}>
                <ActionIcon
                  onClick={handleClickSelectOff}
                  variant="default"
                  size={36}
                >
                  <IconArrowBackUp />
                </ActionIcon>
              </Tooltip>
            </>
          ) : isReadMode ? (
            <>
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
            </>
          ) : (
            isEditMode && (
              <>
                <BoldActionIcon editor={editor} />
                <ActionIcon.Group>
                  <ListActionIcon func={formatList} type="bullet" />
                  <ListActionIcon func={formatList} type="number" />
                </ActionIcon.Group>
              </>
            )
          )}
        </div>
      </div>
    </>
  );
}

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  number: "Numbered List",
  check: "Check List",
  paragraph: "Normal",
};
