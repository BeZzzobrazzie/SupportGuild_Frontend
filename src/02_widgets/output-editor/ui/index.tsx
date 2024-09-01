import { RichTextEditor } from "@mantine/tiptap";
import Link from "@tiptap/extension-link";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useState } from "react";
import { BaseEditor, createEditor, Descendant } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import {
  saveOutputEditorChange,
  templateCardsSlice,
} from "src/04_entities/template-card/model";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";

export function OutputEditor({
  setOutputEditor,
}: {
  setOutputEditor: React.Dispatch<
    React.SetStateAction<(BaseEditor & ReactEditor) | null>
  >;
}) {
  const dispatch = useAppDispatch();
  // const content = "";
  // const editor = useEditor({
  //   extensions: [StarterKit, Link],
  //   content,
  // });

  // return (
  //   <RichTextEditor editor={editor}>
  //     <RichTextEditor.Content />
  //   </RichTextEditor>
  // );
  const outputEditorChanged = useAppSelector(
    (state) => state.templateCards.outputEditorChanged
  );
  const outputEditorContent = useAppSelector((state) =>
    templateCardsSlice.selectors.selectOutputEditorContent(state)
  );
  // const initialValue: Descendant[] = [
  //   {
  //     type: "paragraph",
  //     children: [{ text: "A line of text in a paragraph." }],
  //   },
  // ];
  const initialValue = outputEditorContent;
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const handleChange = useCallback((newValue: Descendant[]) => {
    setValue(newValue);
  }, []);

  const [editor] = useState(() => withReact(createEditor()));

  useEffect(() => {
    setOutputEditor(editor);
  }, [editor, setOutputEditor]);

  return (
    // Add the editable component inside the context.
    <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
      <Editable style={{ width: "100%" }} />
    </Slate>
  );
}
