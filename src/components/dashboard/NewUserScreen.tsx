import { Box, Center, Text } from "@chakra-ui/react";

function NewUserScreen() {
  return (
    <Box w="100%">
      <Center flexDirection={"column"} w="100%" px={5}>
        <Text fontSize="2xl">
          {" "}
          Hola from Denota! Check out our docs on the sidebar.
        </Text>
      </Center>
    </Box>
  );
}

export default NewUserScreen;
