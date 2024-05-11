import React from "react";

interface FormTextAreaProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  default?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function FormTextArea(props: FormTextAreaProps) {
  const [count, setCount] = React.useState(0);
  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCount(e.target.value.length);
    if (props.onChange) {
      props.onChange(e);
    }
  }
  return (
    <div>
      <label className="mb-3 text-sm font-medium text-black dark:text-white flex justify-between items-baseline">
        <div>
          {props.label || "Default textarea"}
          {props.required && <span className="ml-2 text-primary">*</span>}
        </div>
        <p className={"font-normal text-xs"}>{count}/1000</p>
      </label>
      <textarea
        rows={6}
        required={props.required}
        readOnly={props.readonly}
        disabled={props.disabled}
        defaultValue={props.default}
        value={props.value}
        maxLength={1000}
        onChange={handleOnChange}
        placeholder={props.placeholder || "Default textarea"}
        className="w-full resize-none rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      ></textarea>
    </div>
  );
}
