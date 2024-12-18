import { explorerSlice } from "src/04_entities/explorer/model";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import {
  useAddMutation,
  usePasteMutation,
  useRemoveMutation,
} from "../api/mutations";
import {
  copySelected,
  resetSelected,
  searchModeOff,
  searchModeOn,
  selectedModeOff,
  selectedModeOn,
  selectSelectedIds,
  templateCardsSlice,
} from "../model";
import { selectAllThunk } from "../model/select-all-thunk";

import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
  ActionIcon,
  Button,
  Chip,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowBackUp,
  IconCheckbox,
  IconClipboard,
  IconClipboardCopy,
  IconListCheck,
  IconSearch,
  IconSquare,
  IconSquarePlus,
  IconTrash,
} from "@tabler/icons-react";
import { MutableRefObject, RefObject, useState } from "react";
import { useTranslation } from "react-i18next";
import { BoldActionIcon, ListActionIcon } from "src/03_features/action-icon";
import { useCardEditor } from "../lib/context";
import classes from "./command-panel.module.css";
import { SearchInput } from "./search-input";
import { SearchModeSwitcher } from "./search-mode-switcher";
import { LinkActionIcon } from "src/03_features/action-icon/ui/link-action-icon";
import { UnlinkActionIcon } from "src/03_features/action-icon/ui/unlink-action-icon";

interface CommandPanelProps {
  widgetRef: RefObject<HTMLInputElement>;
}
export function CommandPanel({ widgetRef }: CommandPanelProps) {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  // const isSelectedMode = useAppSelector((state) =>
  //   templateCardsSlice.selectors.selectIsSelectedMode(state)
  // );
  const mode = useAppSelector((state) =>
    templateCardsSlice.selectors.selectMode(state)
  );
  const isReadMode = mode === "read";
  const isEditMode = mode === "edit";
  const isSelectedMode = mode === "select";
  const isSearchMode = mode === "search";
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
    // if (widgetRef.current) {
    //   widgetRef.current.scrollIntoView({behavior: "smooth", block: "end"});
    // }
  }

  function handleClickSearch() {
    dispatch(searchModeOn());
  }
  function handleClickSearchOff() {
    dispatch(searchModeOff());
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
                <Tooltip label={t("commandPanel.numberOfSelected")}>
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
                <Tooltip label={t("commandPanel.selectAll")}>
                  <ActionIcon
                    onClick={handleClickSelectAll}
                    variant="default"
                    size={36}
                  >
                    <IconCheckbox />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label={t("commandPanel.deselect")}>
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
                  {t("commandPanel.copy")}
                </Button>
                <Button
                  leftSection={<IconTrash />}
                  size="sm"
                  variant="outline"
                  color="red"
                  onClick={handleClickDelete}
                >
                  {t("commandPanel.delete")}
                </Button>
              </Button.Group>

              <Tooltip label={t("commandPanel.turnOffSelectMode")}>
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
                  {t("commandPanel.create")}
                </Button>
                <Button
                  leftSection={<IconListCheck />}
                  size="sm"
                  variant="default"
                  onClick={handleClickSelect}
                >
                  {t("commandPanel.select")}
                </Button>
                <Button
                  leftSection={<IconClipboard />}
                  size="sm"
                  variant="default"
                  onClick={handleClickPaste}
                >
                  {t("commandPanel.paste")}
                </Button>
                <Button
                  leftSection={<IconSearch />}
                  size="sm"
                  variant="default"
                  onClick={handleClickSearch}
                  // disabled
                >
                  {t("commandPanel.search")}
                </Button>
              </Button.Group>
            </>
          ) : isSearchMode ? (
            <>
              <SearchModeSwitcher />
              <SearchInput />
              <Tooltip label={t("commandPanel.turnOffSearchMode")}>
                <ActionIcon
                  onClick={handleClickSearchOff}
                  variant="default"
                  size={36}
                >
                  <IconArrowBackUp />
                </ActionIcon>
              </Tooltip>
            </>
          ) : (
            isEditMode && (
              <>
                <BoldActionIcon editor={editor} />
                <ActionIcon.Group>
                  <ListActionIcon func={formatList} type="bullet" />
                  <ListActionIcon func={formatList} type="number" />
                </ActionIcon.Group>
                <ActionIcon.Group>
                  <LinkActionIcon editor={editor} />
                  <UnlinkActionIcon editor={editor} />
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
