import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { ethers } from "ethers";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  TextInput,
  Button,
  Box,
  Image,
  SimpleGrid,
  Text,
  Divider,
} from "@mantine/core";

import { addresses, abiQaravan } from "../conf";

import uploadToIPFS from "../../lib/uploadToIPFS";

export default function AddDelivery() {
  const { chain }: any = useNetwork();
  const address = chain?.unsupported ? addresses[5] : addresses[chain?.id];

  const [deliveryImageCID, setDeliveryImageCID] = useState("");

  const form = useForm({
    initialValues: {
      deliveryName: "",
      deliveryDescription: "",
      deliveryGetRequest: "",
      deliveryPathRequest: "",
      deliveryJobId: "",
    },
  });

  const { config: configDelivery }: any = usePrepareContractWrite({
    address,
    abi: abiQaravan,
    functionName: "addDeliveryService",
    args: [
      form.values.deliveryName,
      deliveryImageCID,
      form.values.deliveryDescription,
      form.values.deliveryGetRequest,
      form.values.deliveryPathRequest,
      ethers.constants.HashZero,
    ],
  });

  const { write: writeDelivery } = useContractWrite(configDelivery);

  const [files, setFiles] = useState<FileWithPath[]>([]);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

  useEffect(() => {
    if (files[0]) uploadToIPFS(files[0], setDeliveryImageCID);
  }, [files]);

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form
        onSubmit={form.onSubmit(() => {
          console.log("writeDelivery");
          if (writeDelivery) writeDelivery();
        })}
      >
        <TextInput
          label="Delivery service name"
          placeholder="Delivery service name"
          autoComplete="off"
          {...form.getInputProps("deliveryName")}
        />
        <TextInput
          label="Delivery service description"
          placeholder="Delivery service description"
          mt="md"
          autoComplete="off"
          {...form.getInputProps("deliveryDescription")}
        />
        <Box my={10}>
          <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
            <Text align="center">Drop image here</Text>
          </Dropzone>

          <SimpleGrid
            cols={4}
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
            mt={previews.length > 0 ? "xl" : 0}
          >
            {previews}
          </SimpleGrid>
        </Box>
        <Divider my="xs" variant="dashed" labelPosition="center" />
        <TextInput
          label="Chainlink Job Id"
          placeholder="Chainlink Job Id"
          autoComplete="off"
          {...form.getInputProps("deliveryJobId")}
        />
        <Divider
          my="xs"
          variant="dashed"
          labelPosition="center"
          label={
            <>
              <Box ml={5}>OR</Box>
            </>
          }
        />
        <TextInput
          label="Chainlink Get Request"
          placeholder="Chainlink Get Request"
          autoComplete="off"
          {...form.getInputProps("deliveryGetRequest")}
        />
        <TextInput
          label="Chainlink Path Request"
          placeholder="Chainlink Path Request"
          mt="md"
          autoComplete="off"
          {...form.getInputProps("deliveryPathRequest")}
        />
        <Button fullWidth disabled={!writeDelivery} type="submit" mt="md">
          Submit
        </Button>
      </form>
    </Box>
  );
}
