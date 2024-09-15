import { Card, Flex } from "@chakra-ui/react";
import { Step } from "./Step";

const Steps = [
  {
    // icon: "/steps/1.svg",
    icon: "/steps/1.jpeg",
    title: "Looking to loan furniture",
    description: "Loan furniture to give it a second chance.",
  },
  {
    icon: "/steps/22.png",
    title: "Upload the loaned furniture",
    description: "Upload your loaned furniture and AI will verify the products.",
  },
  {
    icon: "/steps/3.svg",
    title: "Earn rewards",
    description: "Earn B3TR for loaning furniture.",
  },
];

export const Instructions = () => {
  return (
    <Card mt={3} w={"full"}>
      <Flex p={{ base: 4 }} w="100%" direction={{ base: "column", md: "row" }}>
        {Steps.map((step, index) => (
          <Step key={index} {...step} />
        ))}
      </Flex>
    </Card>
  );
};
