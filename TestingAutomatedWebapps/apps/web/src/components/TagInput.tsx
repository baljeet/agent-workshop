import { useState, type ReactElement } from "react";

interface TagInputProps {
  label: string;
  placeholder: string;
  onChange(values: string[]): void;
}

export const TagInput = ({ label, placeholder, onChange }: TagInputProps): ReactElement => {
  const [value, setValue] = useState("");
  const [items, setItems] = useState<string[]>([]);

  const addItem = (): void => {
    const next = value.trim();
    if (!next) {
      return;
    }
    const updated = [...items, next];
    setItems(updated);
    onChange(updated);
    setValue("");
  };

  const removeItem = (index: number): void => {
    const updated = items.filter((_, currentIndex) => currentIndex !== index);
    setItems(updated);
    onChange(updated);
  };

  return (
    <div className="field-group">
      <label>{label}</label>
      <div className="tag-input-row">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
        />
        <button type="button" onClick={addItem}>
          Add
        </button>
      </div>
      <div className="chips">
        {items.map((item, index) => (
          <button key={`${item}-${index}`} type="button" className="chip" onClick={() => removeItem(index)}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};
