import { Component, createSignal, onMount } from 'solid-js';
import './InlineInput.css';

interface InlineInputProps {
  initialValue?: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  placeholder?: string;
}

export const InlineInput: Component<InlineInputProps> = (props) => {
  const [value, setValue] = createSignal(props.initialValue || '');
  let inputRef: HTMLInputElement | undefined;

  onMount(() => {
    inputRef?.focus();
    inputRef?.select();
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = value().trim();
      if (trimmed) {
        props.onSave(trimmed);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      props.onCancel();
    }
  };

  const handleBlur = () => {
    const trimmed = value().trim();
    if (trimmed) {
      props.onSave(trimmed);
    } else {
      props.onCancel();
    }
  };

  return (
    <div class="inline-input-container">
      <span class="file-icon">📄</span>
      <input
        ref={inputRef}
        type="text"
        class="inline-input"
        value={value()}
        onInput={(e) => setValue(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={props.placeholder || 'Section name...'}
      />
    </div>
  );
};
