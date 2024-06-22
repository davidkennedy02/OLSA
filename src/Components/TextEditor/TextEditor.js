import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import s from './TextEditor.module.css';

export default function TextEditor(props) {
  const editorRef = useRef(null);

  return (
    <>
      <Editor
        id={s.editor_window}
        apiKey='i5wytvoeptyrjt2qd858c49efwfsafyn1hb5mijotfr31279'
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={props.initialValue}
        init={{
          height: '80vh',
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onEditorChange={props.handleChange}
      />
    </>
  );
}