import React from "react";

interface FormTextAreaProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function FormTextArea(props: FormTextAreaProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        {props.label || "Default textarea"}
        {props.required && <span className="ml-2 text-primary">*</span>}
      </label>
      <textarea
        rows={6}
        required={props.required}
        readOnly={props.readonly}
        disabled={props.disabled}
        onChange={props.onChange}
        placeholder={props.placeholder || "Default textarea"}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      ></textarea>
    </div>
  );
}
