import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';


export function TemplateCard() {

  const [editable, setEditable] = useState(true);
  const content = "Hello, it's plain text"
  const editor = useEditor({
    extensions: [
      StarterKit
    ],
    content,
    editable
  })

  function handleClick() {
    setEditable(!editable)
    console.log('click')
    console.log(editable)
  }

  useEffect(() => {
    if (!editor) {
      return undefined
    }

    editor.setEditable(editable)
  }, [editor, editable])

  return (
    <div>
      card
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <button onClick={handleClick}>hi</button>
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  )
}