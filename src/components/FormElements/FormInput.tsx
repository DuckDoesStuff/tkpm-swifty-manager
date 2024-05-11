import React from "react";

interface FormInputProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  default?: any;
  value?: any;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput(props: FormInputProps) {
  return (
    <div>
      <label className="mb-3 block text-md font-medium text-black dark:text-white">
        {props.label || "Default Input"}
        {props.required && <span className="ml-2 text-primary">*</span>}
      </label>
      <input
        type={props.type || "text"}
        min={props.type === "number" ? 0 : undefined}
        value={props.value}
        defaultValue={props.default}
        required={props.required}
        readOnly={props.readonly}
        disabled={props.disabled}
        onChange={props.onChange}
        placeholder={props.placeholder || "Default Input"}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>
  );
}
