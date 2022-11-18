import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import EthCrypto from "eth-crypto";
import { Modal } from "@mantine/core";
import { forwardRef } from "react";
import { Avatar, Select } from "@mantine/core";
import { IconDatabase, IconShoppingCartPlus } from "@tabler/icons";
import { useForm } from "@mantine/form";
import {
  paginatedIndexesConfig,
  useContractInfiniteReads,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useToken,
} from "wagmi";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Textarea,
  SimpleGrid,
} from "@mantine/core";

import { address, abiQaravan, abiERC1155, abiERC20 } from "../conf";

export default function GetSeller() {
  let { seller, erc1155 }: any = useParams();

  const [list, setList] = useState([]);

  const { data: sellerAccount }: any = useContractRead({
    address,
    abi: abiQaravan,
    functionName: "getSellerAccount",
    args: [seller] as const,
  });

  const { data: nftData }: any = useContractInfiniteReads({
    cacheKey: "nftData",
    ...paginatedIndexesConfig(
      (index) => {
        return [
          {
            address: erc1155,
            abi: abiERC1155,
            functionName: "uri",
            args: [BigNumber.from(index)] as const,
          },
          {
            address: erc1155,
            abi: abiERC1155,
            functionName: "balanceOf",
            args: [seller, BigNumber.from(index)] as const,
          },
        ];
      },
      { start: 0, perPage: 20, direction: "increment" }
    ),
  });

  function getAllData(URLs: any) {
    return Promise.all(URLs.map(fetchData));
  }

  async function fetchData(URL: any) {
    return axios
      .get(URL.link)
      .then(function (response) {
        return {
          success: true,
          id: URL.id,
          data: response.data,
        };
      })
      .catch(function (error) {
        return { success: false };
      });
  }

  useEffect(() => {
    if (!nftData || !nftData.pages) return;
    const URLs: any = [];
    nftData.pages.forEach((page: any, pageIndex: any) => {
      for (let i = 0; i < page.length; i = i + 2) {
        if (!ethers.BigNumber.from("0").eq(page[i + 1])) {
          const id = i === 0 ? 0 : i / 2;
          const l =
            "0000000000000000000000000000000000000000000000000000000000000000" +
            ethers.BigNumber.from(id.toString()).toHexString().substring(2);
          URLs.push({
            link:
              page[i]
                .replace("{id}", l.substring(l.length - 64, l.length))
                .replace("ipfs://", "https://gateway.pinata.cloud/ipfs/") +
              "?" +
              Math.random(),
            id,
          });
        }
      }
    });
    getAllData(URLs)
      .then((resp: any) => {
        setList(resp);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [nftData]);

  return (
    <SimpleGrid cols={3}>
      {list.map((l: any, i: any) => {
        const erc20 = l.data.attributes.filter(
          (v: any) => v.trait_type === "Token"
        )[0].value;
        const amount = l.data.attributes.filter(
          (v: any) => v.trait_type === "Amount"
        )[0].value;
        return (
          <CardGoods
            key={i}
            id={l.id}
            seller={seller}
            name={l.data.name}
            image={l.data.image}
            description={l.data.description}
            erc20={erc20}
            amount={amount}
            erc1155={erc1155}
            publicKey={sellerAccount.publicKey}
          />
        );
      })}
    </SimpleGrid>
  );
}

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={`https://ipfs.io/ipfs/${image}`} />
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

function CardGoods({
  id,
  seller,
  name,
  image,
  description,
  erc20,
  amount,
  erc1155,
  publicKey,
}: any) {
  const { data } = useToken({
    address: erc20,
  });

  const [opened, setOpened] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryServ, setDeliveryServ] = useState([]);

  const [deliveryService, setDeliveryService] = useState<string | null>("0");

  const form = useForm({
    initialValues: { publicKey: "", deliveryAddress: "" },
  });

  useEffect(() => {
    const storedValue = window.localStorage.getItem("user-form");
    if (storedValue) {
      try {
        form.setValues(
          JSON.parse(window.localStorage.getItem("user-form") || "{}")
        );
      } catch (e) {
        console.log("Failed to parse stored value");
      }
    }
  }, []);

  // async function crypt(message: any) {
  //   if (publicKey) {
  //     const en = EthCrypto.cipher.stringify(await EthCrypto.encryptWithPublicKey(
  //       publicKey, // publicKey
  //       message // message
  //     ));
  //     setDeliveryAddress(en);
  //   }
  // }

  useEffect(() => {
    window.localStorage.setItem("user-form", JSON.stringify(form.values));
    // crypt(form.values.deliveryAddress);
  }, [form.values]);

  const { config: configOrder }: any = usePrepareContractWrite({
    address,
    abi: abiQaravan,
    functionName: "addOrder",
    args: [
      {
        erc20: {
          token: erc20,
          amount: ethers.utils.parseEther(amount.toString()),
        },
        erc1155: {
          token: erc1155,
          ids: [BigNumber.from(id.toString())],
          amounts: [BigNumber.from("1")],
        },
      },
      BigNumber.from(deliveryService),
      seller,
      form.values.deliveryAddress,
    ],
  });
  const { write: writeOrder } = useContractWrite(configOrder);

  const { data: deliveryServices }: any = useContractInfiniteReads({
    cacheKey: "getDeliveryService",
    ...paginatedIndexesConfig(
      (index) => {
        return [
          {
            address,
            abi: abiQaravan,
            functionName: "getDeliveryService",
            args: [BigNumber.from(index)] as const,
          },
        ];
      },
      { start: 1, perPage: 10, direction: "increment" }
    ),
  });

  useEffect(() => {
    if (deliveryServices.pages) {
      const res: any = [];
      deliveryServices.pages[0].forEach((ds: any, i: any) => {
        if (ds[0] === ethers.constants.AddressZero) return;
        const [, label, image, description]: any = ds;
        res.push({ image, label, description, value: i + 1 + "" });
      });
      setDeliveryServ(res);
    }
  }, deliveryServices);

  const { config: configToken }: any = usePrepareContractWrite({
    address: erc20,
    abi: abiERC20,
    functionName: "approve",
    args: [address, ethers.constants.MaxUint256],
  });

  const { write: writeToken } = useContractWrite(configToken);

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Delivery">
        <Select
          label="Choose delivery service"
          placeholder="Pick one"
          itemComponent={SelectItem}
          data={deliveryServ}
          searchable
          maxDropdownHeight={400}
          nothingFound="Nobody here"
          filter={(value, item: any) =>
            item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
            item.description.toLowerCase().includes(value.toLowerCase().trim())
          }
          onChange={setDeliveryService}
        />
        <Textarea
          placeholder="Delivery address"
          label="Delivery address"
          withAsterisk
          {...form.getInputProps("deliveryAddress")}
        />
        <SimpleGrid cols={2}>
          <Button
            disabled={!!writeOrder || !writeToken}
            fullWidth
            mt="md"
            variant="light"
            leftIcon={<IconDatabase />}
            onClick={() => {
              if (writeToken) writeToken();
            }}
          >
            Approve {data?.symbol}
          </Button>
          <Button
            disabled={!writeOrder}
            fullWidth
            mt="md"
            variant="light"
            leftIcon={<IconShoppingCartPlus />}
            onClick={() => {
              if (writeOrder) writeOrder();
            }}
          >
            BUY {amount} {data?.symbol}
          </Button>
        </SimpleGrid>
      </Modal>
      <Card shadow="sm" m="lg" p="lg" radius="md" withBorder>
        <Card.Section>
          <Image src={image} height={160} alt={name} />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{name}</Text>
          <Badge color="cyan" variant="light">
            On sale
          </Badge>
        </Group>

        <Text size="sm" color="dimmed">
          {description}
        </Text>

        <Button
          variant="light"
          color="green"
          fullWidth
          mt="md"
          radius="md"
          onClick={() => setOpened(true)}
        >
          BUY {amount} {data?.symbol}
        </Button>
      </Card>
    </>
  );
}
