import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useLocalStorage } from "@mantine/hooks";
// import EthCrypto from "eth-crypto";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { TextInput, Button, Box, Image, Text, SimpleGrid } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";

import { address, abiQaravan, abiERC1155 } from "../conf";
import uploadToIPFS from "../../lib/uploadToIPFS";

export default function AddSeller() {
  const [sellerImageCID, setSellerImageCID] = useState("");
  const [sellerPublicKey, setSellerPublicKey]: any = useLocalStorage({
    key: "public-key",
    defaultValue: {},
  });

  useEffect(() => {
    if (!sellerPublicKey) {
      // const identity = EthCrypto.createIdentity();
      // setSellerPublicKey(identity);
    }
  }, [sellerPublicKey]);

  const form = useForm({
    initialValues: {
      sellerName: "",
      sellerDescription: "",
      sellerERC1155: "",
    },
  });

  const { config: configSeller }: any = usePrepareContractWrite({
    address,
    abi: abiQaravan,
    functionName: "addSellerAccount",
    args: [
      form.values.sellerName,
      sellerImageCID,
      form.values.sellerDescription,
      sellerPublicKey.publicKey || "",
      form.values.sellerERC1155,
    ],
  });
  const { write: writeSeller } = useContractWrite(configSeller);

  const { config: configNFT }: any = usePrepareContractWrite({
    address: form.values.sellerERC1155,
    abi: abiERC1155,
    functionName: "setApprovalForAll",
    args: [address, true],
  });
  const { write: writeNFT } = useContractWrite(configNFT);

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
    if (files[0]) uploadToIPFS(files[0], setSellerImageCID);
  }, [files]);

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form
        onSubmit={form.onSubmit(() => {
          if (writeSeller) writeSeller();
        })}
      >
        <TextInput
          label="Seller name"
          placeholder="Seller name"
          autoComplete="off"
          {...form.getInputProps("sellerName")}
        />
        <TextInput
          label="Seller description"
          placeholder="Seller description"
          mt="md"
          autoComplete="off"
          {...form.getInputProps("sellerDescription")}
        />
        <Box my={10}>
          <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
            <Text align="center">Drop image here</Text>
          </Dropzone>

          <SimpleGrid
            cols={4}
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
            mt={previews?.length > 0 ? "xl" : 0}
          >
            {previews}
          </SimpleGrid>
        </Box>
        <TextInput
          label="ERC1155 Goods"
          placeholder="ERC1155 Goods"
          mt="md"
          autoComplete="off"
          {...form.getInputProps("sellerERC1155")}
        />
        {writeNFT && (
          <Button
            fullWidth
            mt="md"
            onClick={() => {
              writeNFT();
            }}
          >
            Approval For All NFT
          </Button>
        )}
        <Button fullWidth disabled={!writeSeller} type="submit" mt="md">
          Submit
        </Button>
      </form>
    </Box>
  );
}
