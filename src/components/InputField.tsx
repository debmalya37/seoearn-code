// components/InputField.tsx

import { FC } from 'react';
import { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputField: FC<InputFieldProps> = ({ label, ...rest }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...rest} />
    </div>
  );
};

export default InputField;
