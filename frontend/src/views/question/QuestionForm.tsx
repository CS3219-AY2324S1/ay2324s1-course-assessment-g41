"use client";
import {
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Stack,
  Text,
  Button,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  CheckboxGroup,
  Checkbox,
  SimpleGrid,
  FormErrorMessage,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

import { Question, QuestionCategories, QuestionComplexity } from "@/@types/models/question";
import { useForm } from "react-hook-form";
import { useQuestions } from "@/hooks/questions/useQuestionList";
import { QuestionDetails } from "./QuestionDetails";
import { useRouter } from "next/navigation";

export const QuestionForm = ({ question = null }: { question: Question | null }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: question ? { ...question } : undefined,
  });
  const { addQuestion, editQuestion } = useQuestions();
  const toast = useToast();
  const router = useRouter();
  const bgColor = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("black", "white");

  register("categories", {
    required: "At least one category must be selected.",
  });

  return (
    <Stack
      px={6}
      py={8}
      bgColor={bgColor}
      borderRadius={12}
      borderColor="gray.100"
      borderWidth={1}
      overflowY="auto"
      height="100%"
      display="flex"
    >
      <Heading fontWeight="bold">Question Details</Heading>
      {question ? null : <Text fontSize="lg">Add a question!</Text>}
      {question ? null : (
        <Text color="gray.500">
          You can record questions you encountered in your technical interviews. By saving a
          question here, you can easily use the question for practice with your peers again.
        </Text>
      )}

      <Tabs variant="soft-rounded" flex={1}>
        <TabList px={0}>
          <Tab color={textColor}>Input</Tab>
          <Tab color={textColor}>Preview</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <Stack spacing={2} display="flex" px={0}>
              <FormControl isInvalid={errors.title ? true : false}>
                <FormLabel htmlFor="title">Question Title</FormLabel>
                <Input
                  type="text"
                  id="title"
                  shadow="sm"
                  size="sm"
                  w="full"
                  color={textColor}
                  rounded="md"
                  focusBorderColor="gray.500"
                  {...register("title", { required: "Title is required." })}
                  defaultValue={question ? question.title : undefined}
                />
                {errors.title ? <FormErrorMessage>{errors.title.message}</FormErrorMessage> : null}
              </FormControl>

              <FormControl isInvalid={errors.complexity ? true : false}>
                <FormLabel htmlFor="complexity">Complexity</FormLabel>
                <Select
                  id="complexity"
                  placeholder={"Select an option"}
                  shadow="sm"
                  size="sm"
                  w="full"
                  color={textColor}
                  rounded="md"
                  focusBorderColor="gray.500"
                  {...register("complexity", {
                    required: "Complexity of the question is required.",
                  })}
                  defaultValue={question ? question.complexity : undefined}
                >
                  {Object.values(QuestionComplexity).map((complexity) => (
                    <option key={complexity}>{complexity}</option>
                  ))}
                </Select>
                {errors.complexity ? (
                  <FormErrorMessage>{errors.complexity.message}</FormErrorMessage>
                ) : null}
              </FormControl>

              <FormControl isInvalid={errors.description ? true : false}>
                <FormLabel htmlFor="title">Description</FormLabel>
                <Textarea
                  placeholder="Describe the problem details. You may write in Markdown."
                  focusBorderColor="gray.500"
                  defaultValue={question ? question.description : undefined}
                  {...register("description", {
                    required: "Description is required.",
                  })}
                  h="20vh"
                  color={textColor}
                />
                {errors.description ? (
                  <FormErrorMessage>{errors.description.message}</FormErrorMessage>
                ) : null}
              </FormControl>

              <FormControl isInvalid={errors.categories ? true : false}>
                <FormLabel htmlFor="categories">Topics</FormLabel>
                {errors.categories ? (
                  <FormErrorMessage>{errors.categories.message}</FormErrorMessage>
                ) : null}
                <CheckboxGroup
                  onChange={(val: string[]) => {
                    setValue("categories", val);
                    trigger("categories");
                  }}
                  defaultValue={question ? question.categories : undefined}
                >
                  <SimpleGrid gap={1} columns={{ sm: 2, md: 3, lg: 5, xl: 6 }}>
                    {Object.values(QuestionCategories).map((val) => (
                      <Checkbox key={val} value={val} size="sm" color={textColor}>
                        {val}
                      </Checkbox>
                    ))}
                  </SimpleGrid>
                </CheckboxGroup>
              </FormControl>
            </Stack>
          </TabPanel>

          <TabPanel px={0}>
            <QuestionDetails
              title={watch("title")}
              complexity={watch("complexity")}
              categories={watch("categories")}
              description={watch("description")}
              id={-1}
              isPreview={true}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Button
        type="submit"
        onClick={handleSubmit((data) => {
          try {
            question
              ? editQuestion({
                  id: question.id,
                  categories: data.categories ? data.categories : [],
                  title: data.title,
                  description: data.description,
                  complexity: data.complexity,
                })
              : addQuestion({
                  categories: data.categories ? data.categories : [],
                  title: data.title,
                  description: data.description,
                  complexity: data.complexity,
                });
            router.push("/questions");
          } catch (err: any) {
            toast({
              status: "error",
              description: err?.message || "Unknown error encountered. Please try again later.",
              isClosable: true,
              duration: 3000,
              position: "bottom",
            });
          }
        })}
        w="fit-content"
        py={2}
        size="sm"
      >
        Confirm
      </Button>
    </Stack>
  );
};
