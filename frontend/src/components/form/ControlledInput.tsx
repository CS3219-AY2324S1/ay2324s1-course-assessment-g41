import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";

interface ControlledInputProps {
  controlName: string;
  label: string;
  register: any;
  errors: any;
  color: string;
  required?: boolean;
}

const ControlledInput: React.FC<ControlledInputProps> = ({
  controlName,
  label,
  register,
  errors,
  color,
  required,
}) => {
  return (
    <FormControl id={controlName} isInvalid={errors[controlName] ? true : false}>
      <FormLabel>{label}</FormLabel>
      <Input {...register(controlName, { required })} color={color} />
      <FormErrorMessage>{errors[controlName] && "This field is required"}</FormErrorMessage>
    </FormControl>
  );
};

export default ControlledInput;
