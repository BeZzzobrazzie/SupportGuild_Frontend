import { useCallback, useEffect, useState } from "react";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  EditorState,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  CLEAR_EDITOR_COMMAND,
} from "lexical";
import { mergeRegister } from "@lexical/utils";

import classes from "./style.module.css";
import { useOutputEditor } from "../lib/context";
import { EnterKeyPlugin } from "src/05_shared/lexical-plugins/enter-key-plugin";
import TreeViewPlugin from "src/05_shared/lexical-plugins/tree-view-plugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { MATCHERS } from "src/05_shared/lexical-plugins/auto-link-matcher";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { $generateHtmlFromNodes } from "@lexical/html";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@lexical/list";
import { BoldActionIcon, ListActionIcon } from "src/03_features/action-icon";
import {
  ActionIcon,
  Button,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconCopy,
  IconEraser,
  IconError404,
  IconItalic,
  IconNewSection,
  IconSquarePlus,
  IconUnderline,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LinkActionIcon } from "src/03_features/action-icon/ui/link-action-icon";
import { useAppSelector } from "src/05_shared/redux";
import { templateCardsSlice } from "src/04_entities/template-card/model";

const theme = {
  paragraph: classes["editor-paragraph"],
};

function onError(error: Error) {
  console.log(error);
}

export function OutputEditor() {
  const initialConfig = {
    namespace: "OutputEditor",
    onError,
    nodes: [AutoLinkNode, ListNode, ListItemNode, LinkNode],
    theme,
  };
  const { t, i18n } = useTranslation();
  const [editorState, setEditorState] = useState<EditorState>();
  function onChange(editorState: EditorState) {
    setEditorState(editorState);
  }
  // const theme = useMantineTheme();
  // const computedColorScheme = useComputedColorScheme();
  // const backgroundColor =
  //   computedColorScheme === "dark" ? theme.colors.surface[0] : undefined;

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={classes["editor-wrapper"]}>
        <div
          className={classes["editor-container"]}
          // style={{
          //   backgroundColor,
          // }}
        >
          <ToolbarPlugin />
          <div className={classes["editor-content-wrapper"]}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={classes["editor-content"]}
                  // onFocus={() => console.log('focus')}
                />
              }
              placeholder={
                <div className={classes["editor-content-placeholder"]}>
                  {t("editor.placeholder")}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={onChange} />
          <AutoLinkPlugin matchers={MATCHERS} />
          <LinkPlugin />
          <ListPlugin />
          <ClearEditorPlugin />

          {/* <EnterKeyPlugin /> */}
          {false && <TreeViewPlugin />}

          <EditorInitializer />
        </div>
      </div>
    </LexicalComposer>
  );
}

const EditorInitializer = () => {
  const [editor] = useLexicalComposerContext();
  const { setEditor } = useOutputEditor();

  useEffect(() => {
    if (editor) {
      setEditor(editor); // Сохраняем инстанс редактора в контекст
    }
  }, [editor, setEditor]);

  return null;
};

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  number: "Numbered List",
  check: "Check List",
  paragraph: "Normal",
};

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const { t, i18n } = useTranslation();
  const mode = useAppSelector((state) =>
    templateCardsSlice.selectors.selectMode(state)
  );

  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const formatList = (listType: "bullet" | "number" | "check") => {
    // console.log(blockType);
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
  };

  const isEditable = editor.isEditable();

  function handleClickEdit() {
    editor.setEditable(!isEditable);
  }
  function handleClickClear() {
    // editor.update(() => {
    //   const root = $getRoot();
    //   root.clear();
    // });

    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
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

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        1
      )
      // editor.registerCommand(
      //   CAN_UNDO_COMMAND,
      //   (payload) => {
      //     setCanUndo(payload);
      //     return false;
      //   },
      //   LowPriority,
      // ),
      // editor.registerCommand(
      //   CAN_REDO_COMMAND,
      //   (payload) => {
      //     setCanRedo(payload);
      //     return false;
      //   },
      //   LowPriority,
      // ),
    );
  }, [editor, $updateToolbar]);

  return (
    <div className={classes["editor-toolbar"]}>
      {/* <button onClick={handleClickEdit}>Toggle editable</button> */}
      <div className={classes["editor-toolbar__action-icons"]}>
        <ActionIcon.Group>
          <BoldActionIcon editor={editor} />
          <Tooltip label={t("editor.italicFont")}>
            <ActionIcon variant="default" disabled>
              <IconItalic />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t("editor.underline")}>
            <ActionIcon variant="default" disabled>
              <IconUnderline />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t("editor.crossedOut")}>
            <ActionIcon variant="default" disabled>
              <IconError404 />
            </ActionIcon>
          </Tooltip>
        </ActionIcon.Group>

        <ActionIcon.Group>
          <ListActionIcon func={formatList} type="bullet" />
          <ListActionIcon func={formatList} type="number" />
        </ActionIcon.Group>
        <ActionIcon.Group>
          <LinkActionIcon editor={editor} keyCombination={!(mode === "edit")} />
        </ActionIcon.Group>
      </div>

      <div className={classes["editor-toolbar__buttons"]}>
        <Button.Group>
          <Button
            leftSection={<IconCopy />}
            size="sm"
            variant="default"
            onClick={handleClickCopyToClipboard}
          >
            {t("outputEditor.copyToClipboard")}
          </Button>
          <Tooltip label={t("outputEditor.saveAsCardLabel")}>
            <Button
              leftSection={<IconNewSection />}
              size="sm"
              variant="default"
              disabled
            >
              {t("outputEditor.saveAsCard")}
            </Button>
          </Tooltip>
        </Button.Group>

        <Button
          leftSection={<IconEraser />}
          size="sm"
          variant="outline"
          color="red"
          onClick={handleClickClear}
        >
          {t("outputEditor.clear")}
        </Button>
      </div>
    </div>
  );
}
