import { BigNumber, ethers } from "ethers";
import { Link } from "react-router-dom";
import {
  paginatedIndexesConfig,
  useContractInfiniteReads,
  useNetwork,
} from "wagmi";
import { IconX } from "@tabler/icons";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  SimpleGrid,
  Notification,
} from "@mantine/core";

import { addresses, abiQaravan } from "../conf";

export default function GetSellers() {
  const { chain }: any = useNetwork();
  const address = chain?.unsupported ? addresses[5] : addresses[chain?.id];

  const { data: goods }: any = useContractInfiniteReads({
    cacheKey: "getGoods",
    ...paginatedIndexesConfig(
      (index) => {
        return [
          {
            address,
            abi: abiQaravan,
            functionName: "getGoods",
            args: [BigNumber.from(index)] as const,
          },
        ];
      },
      { start: 1, perPage: 10, direction: "increment" }
    ),
  });

  const g =
    goods &&
    goods.pages &&
    goods.pages[0] &&
    goods.pages[0][0] &&
    goods.pages[0].filter(
      (item: any) => item[0] !== ethers.constants.AddressZero
    );

  return (
    <SimpleGrid>
      {g && g.length ? (
        <SimpleGrid cols={3}>
          {g.map((item: any, i: any) => (
            <CardGoods
              key={i}
              address={item[0]}
              name={item[1][0]}
              image={item[1][1]}
              description={item[1][2]}
              erc1155={item[1][4]}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Notification icon={<IconX size={18} />} color="red" disallowClose>
          There are no sellers yet.
        </Notification>
      )}
    </SimpleGrid>
  );
}

function CardGoods({ address, name, image, description, erc1155 }: any) {
  return (
    <Card shadow="sm" m="lg" p="lg" radius="md" withBorder>
      <Card.Section component={Link} to={`/sellers/${address}/${erc1155}`}>
        <Image src={`https://ipfs.io/ipfs/${image}`} height={160} alt={name} />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{name}</Text>
        <Badge color="green" variant="light">
          {address.slice(0, 4)}..
          {address.slice(address.length - 2, address.length)}
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        {description}
      </Text>

      <Link
        to={`/sellers/${address}/${erc1155}`}
        style={{ textDecoration: "none" }}
      >
        <Button variant="light" color="blue" fullWidth mt="md" radius="md">
          Show goods
        </Button>
      </Link>
    </Card>
  );
}
