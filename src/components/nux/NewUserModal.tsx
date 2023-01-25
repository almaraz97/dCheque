import { Center, VStack, Text, Button, Link } from "@chakra-ui/react";
import SimpleModal from "../designSystem/SimpleModal";
import Cookies from "js-cookie";
import { useBlockchainData } from "../../context/BlockchainDataProvider";
import { ExternalLinkIcon } from "@chakra-ui/icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function NewUserModal(props: Props) {
  return (
    <SimpleModal hideClose={true} {...props}>
      <NewUserModalContent onClose={props.onClose} />
    </SimpleModal>
  );
}

interface ContentProps {
  onClose: () => void;
}

function NewUserModalContent({ onClose }: ContentProps) {
  const { blockchainState } = useBlockchainData();

  return (
    <Center p={5}>
      <VStack>
        <img src="data:image/png;base64,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"></img>
        <Text fontWeight={600} fontSize={"2xl"} textAlign="center">
          Hey! Welcome to Cheq!
        </Text>
        <Text fontWeight={600} fontSize={"lg"} textAlign="center"></Text>
        <Link
          fontWeight={600}
          fontSize={"lg"}
          href="https://chakra-ui.com"
          isExternal
          pb={3}
        >
          Looks like you're new here. Here's our docs
          <ExternalLinkIcon mx="2px" />
        </Link>
        <Button
          onClick={() => {
            Cookies.set(blockchainState.account, "1");
            onClose();
          }}
        >
          Got it!
        </Button>
      </VStack>
    </Center>
  );
}

export default NewUserModal;