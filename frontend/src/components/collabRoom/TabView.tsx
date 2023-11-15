// components/TabView.tsx
import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import QuestionDescription from "./QuestionDescription";
import Card from "src/components/card/Card";

const TabView = () => {
  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} height="60vh">
      <Tabs height="100%">
        <TabList>
          <Tab>Description</Tab>
        </TabList>
        <TabPanels height="calc(100% - 40px)" pt={4}>
          <TabPanel height="100%" p={0}>
            <QuestionDescription />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  );
};

export default TabView;
