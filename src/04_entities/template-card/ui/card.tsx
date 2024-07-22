import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { templateCardIdType } from "src/05_shared/api/template-cards/types";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { resetEditing, startEditing, templateCardsSlice } from "../model";
import { RemoveCard } from "./remove-card";
import Link from "@tiptap/extension-link";

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
  const isEditing = idEditingCard === id;
  const content = card?.content;
  console.log(content);
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content,
    editable: isEditing,
  });

  function handleClickEdit() {
    dispatch(startEditing(id));
  }
  function handleClickReset() {
    dispatch(resetEditing());
    if (content) {
      editor?.commands.setContent(content);
    } else {
      editor?.commands.setContent("");
    }
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
      <div>
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar>
            {/* <span>Name: {card.name}</span> */}

            <RichTextEditor.ControlsGroup>
              {isEditing ? (
                <>
                  <button>Save</button>
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
    );
  }

  return componentContent;
}
