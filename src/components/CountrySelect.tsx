import React from 'react';
import Select from 'react-select';
import { getNames, getCode } from 'country-list';

const countryOptions = getNames().map((name: any) => ({
  value: getCode(name) || "",
  label: name,
}));

type CountrySelectProps = {
  value: string;
  onChange: (value: string) => void;
};

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  const handleChange = (selectedOption: any) => {
    onChange(selectedOption ? selectedOption.value : '');
  };

  return (
    <Select
      options={countryOptions}
      value={countryOptions.find((option: { value: string; }) => option.value === value)}
      onChange={handleChange}
      placeholder="Select a country"
    />
  );
};

export default CountrySelect;
