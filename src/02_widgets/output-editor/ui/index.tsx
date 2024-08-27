import { RichTextEditor } from "@mantine/tiptap";
import Link from "@tiptap/extension-link";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from 'slate-react'

export function OutputEditor() {
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

  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]
  const [editor] = useState(() => withReact(createEditor()))
  return (
    // Add the editable component inside the context.
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
  )
}
