// Import necessary libraries
import { Box, Button, SimpleGrid, Text, useColorModeValue, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Card from "src/components/card/Card";
import { OptionBase } from "chakra-react-select";
import { useLanguages } from "@/hooks/services/useLanguages";
import { useTopics } from "@/hooks/services/useTopics";
import { UserRequest } from "@/@types/user";
import { useRequest } from "ahooks";
import { updateUser, deleteUser } from "@/services/users";
import useGetIdentity from "@/hooks/auth/useGetIdentity";
import { useEffect, useState } from "react";
import ControlledSelect from "@/components/form/ControlledSelect";
import ControlledInput from "@/components/form/ControlledInput";
import { updateTopics } from "@/services/topics";
import useLogout from "@/hooks/auth/useLogout";
import { useGetLanguages } from "@/hooks/room/useGetLanguages";

type PreFormInput = Omit<UserRequest, "preferred_difficulty" | "preferred_topics">;
type IFormInput = PreFormInput & {
  preferred_difficulty?: string | null;
  preferred_topics?: string[] | null;
};

interface OptionType extends OptionBase {
  value: string;
  label: string;
}

const difficultyOptions: OptionType[] = [
  { value: "0", label: "Easy" },
  { value: "1", label: "Medium" },
  { value: "2", label: "Hard" },
];

function toIFormInput(user: UserRequest): IFormInput {
  const { preferred_difficulty, preferred_topics, ...rest } = user;
  return {
    ...rest,
    preferred_difficulty: preferred_difficulty !== null ? String(preferred_difficulty) : null,
    preferred_topics: preferred_topics?.map((topic) => topic.id) ?? [],
  };
}

function toUserRequest(input: IFormInput): UserRequest {
  const { preferred_difficulty, preferred_topics, ...rest } = input;
  return {
    ...rest,
    preferred_difficulty: preferred_difficulty !== null ? Number(preferred_difficulty) : null,
    // karwi: no use currently
    // preferred_topics: null,
  };
}

export default function GeneralInformation(props: { [x: string]: any }) {
  const { ...rest } = props;
  // const { supportedLanguages: languages } = useGetLanguages();
  const { languages } = useLanguages();
  const { topics } = useTopics();
  const toast = useToast();
  const { identity } = useGetIdentity();
  const callLogout = useLogout();

  console.log("[form values]", toIFormInput(identity));

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";

  // React hook form setup
  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<IFormInput>({
    defaultValues: toIFormInput(identity),
  });

  useEffect(() => {
    reset(toIFormInput(identity)); // Reset the form to the new default values
  }, [identity, reset]);

  const runUpdates = (values: IFormInput) => {
    return Promise.all([
      updateUser(toUserRequest(values)),
      updateTopics(values.preferred_topics ?? []),
    ]);
  };

  const { run: updateUserProfile } = useRequest(runUpdates, {
    manual: true,
    onSuccess: (result, params) => {
      const updatedUser = result[0].data;
      reset(toIFormInput(updatedUser)); // Reset form state after submission is successful
      toast({
        title: "Profile Update Success",
        description: "Your profile has been updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error, params) => {
      toast({
        title: "Update Failed",
        description: `Failed to update profile. ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const { run: deleteUserProfile } = useRequest(deleteUser, {
    manual: true,
    onSuccess: (result, params) => {
      reset(toIFormInput({})); // Reset form state after submission is successful
      toast({
        title: "Profile Delete Success",
        description:
          "Your profile has been deleted successfully! You will be redirected to the login page soon.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      callLogout();
    },
    onError: (error, params) => {
      toast({
        title: "Profile deletion failed. Please try again later.",
        description: `Failed to update profile. ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (data: IFormInput) => {
    updateUserProfile(data);
  };

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} {...rest}>
      <Text color={textColorPrimary} fontWeight="bold" fontSize="2xl" mt="10px" mb="4px">
        Complete Your Profile
      </Text>
      <Text color={textColorSecondary} fontSize="md" me="26px" mb="40px">
        Please provide detailed information about yourself to improve the compatibility with
        potential partners. Our customized algorithm uses this information to match you with the
        best mock interview partner.
      </Text>

      <form
        onSubmit={(e) => {
          console.log("Form submitted");
          handleSubmit(onSubmit)(e);
        }}
      >
        <SimpleGrid columns={2} gap="20px">
          <ControlledInput
            controlName="name"
            label="Username"
            register={register}
            errors={errors}
            color={textColorPrimary}
            required={true}
          />
          <ControlledSelect
            control={control}
            name="preferred_language"
            id="language"
            label="Preferred Language"
            rules={{ required: false }}
            options={
              languages?.data.map((language) => ({
                value: language.id,
                label: language.name,
              })) || []
            }
            placeholder="Select option"
          />
          <Box />
          {/* <ControlledSelect
            control={control}
            name="preferred_topics"
            id="topics"
            label="Preferred Topics"
            rules={{ required: false }}
            options={
              topics?.data.map((topic) => ({
                value: topic.id,
                label: topic.name,
              })) || []
            }
            placeholder="Select option"
            isMulti
          /> */}
          <ControlledSelect
            control={control}
            name="preferred_difficulty"
            id="difficulty"
            label="Preferred Difficulty"
            rules={{ required: false }}
            options={difficultyOptions}
            placeholder="Select option"
          />
          <Button
            type="submit"
            me="100%"
            mb="50px"
            w="140px"
            minW="140px"
            mt={{ base: "20px", "2xl": "auto" }}
            variant="brand"
            fontWeight="500"
            isDisabled={!isDirty || isSubmitting}
            isLoading={isSubmitting}
          >
            Submit
          </Button>
          <Button
            me="100%"
            mb="50px"
            w="140px"
            minW="140px"
            mt={{ base: "20px", "2xl": "auto" }}
            fontWeight="500"
            onClick={deleteUserProfile}
          >
            Delete
          </Button>
        </SimpleGrid>
      </form>
    </Card>
  );
}
