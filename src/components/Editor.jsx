import { useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import styles from './Editor.module.css';

export const Editor = () => {
	const [editor, setEditor] = useState(null);
	const monacoEl = useRef(null);

	useEffect(() => {
		if (monacoEl) {
			setEditor((editor) => {
				console.log(editor);
				if (editor) return editor;

				const newEditor = monaco.editor.create(monacoEl.current, {
					value: ['// Hey! Instead of using my To Do app,','// how about you just watch me build one :)','','function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
					language: 'typescript',
					theme: 'vs-dark',
					fontSize: 14,
					readOnly: false,
					domReadOnly: false,
					cursorBlinking: "hidden",
					cursorStyle: "line",
					minimap: { enabled: false }
				});

				newEditor.onDidChangeModelContent((event) => {
					event.changes.forEach(change => {
						console.log(change);
					});
				});

				setInterval(() => {
					return newEditor.executeEdits(undefined, [{ range: { endColumn: 1, endLineNumber: 1, startColumn: 1, startLineNumber: 1 }, text: "// Hello World!\n"}]);
				}, 3000);

				return newEditor;
			});
		}

		return () => editor?.dispose();
	}, [monacoEl.current]);

	return <div className={styles.Editor} ref={monacoEl}></div>;
};
