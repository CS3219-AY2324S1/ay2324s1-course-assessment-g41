import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { MultiValue, OptionBase, Select } from "chakra-react-select";
import { Control, useController, FieldValues } from "react-hook-form";

interface OptionType extends OptionBase {
  value: string;
  label: string;
}

interface ControlledSelectProps {
  control: Control;
  name: string;
  id: string;
  label: string;
  rules?: object;
  options: OptionType[];
  placeholder?: string;
  isMulti?: boolean;
}

const ControlledSelect: React.FC<ControlledSelectProps> = ({
  control,
  name,
  id,
  label,
  rules,
  options,
  ...props
}) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    rules,
  });
  console.log("[form value] name:", name, "value:", value);

  return (
    <FormControl isInvalid={invalid} id={id}>
      <FormLabel>{label}</FormLabel>
      <Select
        name={name}
        ref={ref}
        onBlur={onBlur}
        options={options}
        value={
          props.isMulti
            ? options && Array.isArray(value)
              ? options.filter((option) => value.includes(option.value))
              : []
            : options && value
            ? options.find((option) => option.value === value)
            : null
        }
        onChange={(option) => {
          if (Array.isArray(option)) {
            // multi-select mode
            const values = option.map((o: OptionType) => o.value);
            onChange(values);
          } else if (option && "value" in option) {
            // single-select mode
            onChange(option.value);
          } else {
            // The select was cleared
            onChange(null);
          }
        }}
        {...props}
      />
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
};

export default ControlledSelect;
