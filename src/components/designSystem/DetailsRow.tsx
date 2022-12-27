import { Box, Center, Flex, Text } from "@chakra-ui/react";

interface Props {
  title: string;
  value: string;
}

function DetailsRow({ title, value }: Props) {
  return (
    <Box py={3} w="100%">
      <Flex direction="row" justifyContent="space-between">
        <Text fontWeight={600} fontSize="md" textAlign="center">
          {title}
        </Text>
        <Text fontWeight={200} fontSize="md" textAlign="center">
          {value}
        </Text>
      </Flex>
    </Box>
  );
}

export default DetailsRow;