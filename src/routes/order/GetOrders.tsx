import { BigNumber, ethers } from "ethers";
import { Stepper, Notification } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconX } from "@tabler/icons";
import {
  paginatedIndexesConfig,
  useAccount,
  useContractInfiniteReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  Text,
  Button,
  Group,
  createStyles,
  TextInput,
  Box,
  Paper,
} from "@mantine/core";

import { address, abiQaravan } from "../conf";

const useStyles: any = createStyles((theme: any, _params: any, getRef) => ({
  root: {
    padding: theme.spacing.md,
  },

  separator: {
    height: 2,
    borderTop: `2px dashed ${
      theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4]
    }`,
    borderRadius: theme.radius.xl,
    backgroundColor: "transparent",
  },

  separatorActive: {
    borderWidth: 0,
    backgroundImage: theme.fn.linearGradient(
      45,
      theme.colors.blue[6],
      theme.colors.cyan[6]
    ),
  },

  stepIcon: {
    ref: getRef("stepIcon"),
    borderColor: "transparent",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.white,
    borderWidth: 0,

    "&[data-completed]": {
      borderWidth: 0,
      backgroundColor: "transparent",
      backgroundImage: theme.fn.linearGradient(
        45,
        theme.colors.blue[6],
        theme.colors.cyan[6]
      ),
    },
  },

  step: {
    transition: "transform 150ms ease",

    "&[data-progress]": {
      transform: "scale(1.05)",
    },
  },
}));

export default function GetOrders() {
  const { address: addressAccount }: any = useAccount();

  const { data: orders }: any = useContractInfiniteReads({
    cacheKey: "getOrder",
    ...paginatedIndexesConfig(
      (index) => {
        return [
          {
            address,
            abi: abiQaravan,
            functionName: "getOrder",
            args: [BigNumber.from(index)] as const,
          },
        ];
      },
      { start: 1, perPage: 10, direction: "increment" }
    ),
  });

  const o =
    orders &&
    orders.pages &&
    orders.pages[0] &&
    orders.pages[0][0] &&
    orders.pages[0].filter(
      (item: any) =>
        item &&
        item[3] !== ethers.constants.AddressZero &&
        (item[3] === addressAccount || item[4] === addressAccount)
    );

  return (
    <>
      {o && o.length ? (
        o.map((item: any, i: any) => {
          return <StepperOrder key={i} id={i + 1} item={item} />;
        })
      ) : (
        <Notification icon={<IconX size={18} />} color="red" disallowClose>
          Haven't had any orders yet.
        </Notification>
      )}
    </>
  );
}

function StepperOrder({ id, item }: any) {
  const [status, , delivery, buyer, seller] = item;

  const { classes } = useStyles();
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(status <= 0 ? 0 : status <= 1 ? 1 : status <= 2 ? 2 : 3);
  }, [status]);

  const [track, setTrack] = useState(delivery.trackNumber);

  const { config: configNumber }: any = usePrepareContractWrite({
    address,
    abi: abiQaravan,
    functionName: "addTrackNumberToOrder",
    args: [BigNumber.from(id), track],
  });

  const { write: writeTrackNumber } = useContractWrite(configNumber);

  const { config: configDelivery }: any = usePrepareContractWrite({
    address,
    abi: abiQaravan,
    functionName: "checkDeliveryOrder",
    args: [BigNumber.from(id)],
  });

  const { write: writeCheckDelivery } = useContractWrite(configDelivery);

  const { config: configComplete }: any = usePrepareContractWrite({
    address,
    abi: abiQaravan,
    functionName: "completeOrder",
    args: [BigNumber.from(id)],
  });

  const { write: writeComplete } = useContractWrite(configComplete);

  return (
    <Box mb={10}>
      <Paper shadow="xs" p="md">
        <Stepper
          classNames={classes}
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
          color="cyan"
          radius="md"
          size="md"
        >
          <Stepper.Step
            label="Step 1"
            description="Set Track Number"
            loading={active === 0}
            style={{ boxShadow: "none" }}
            color="indigo"
          />
          <Stepper.Step
            label="Step 2"
            description="Check Delivery"
            loading={active === 1}
            style={{ boxShadow: "none" }}
            color="teal"
          />
          <Stepper.Step
            label="Step 3"
            description="Complete the Deal"
            loading={active === 2}
            style={{ boxShadow: "none" }}
            color="violet"
          />
          <Stepper.Completed>
            <Notification title="The transaction is completed" disallowClose>
              <Text>Buyer: {buyer} </Text>
              <Text>Seller: {seller}</Text>
            </Notification>
          </Stepper.Completed>
        </Stepper>
        {active === 0 && (
          <Group position="center" mt="xl">
            <Notification title="Send goods to the address" disallowClose>
              <Text>{delivery.deliveryAddress}</Text>
            </Notification>
            <TextInput
              style={{ width: "100%" }}
              size="md"
              label="Track Number"
              placeholder="Track Number"
              onChange={(e) => setTrack(e.target.value)}
              autoComplete="off"
            />
            <Button
              disabled={!writeTrackNumber}
              fullWidth
              size="md"
              my={5}
              variant="light"
              color="indigo"
              onClick={() => {
                if (writeTrackNumber) writeTrackNumber();
              }}
            >
              Set Track Number
            </Button>
          </Group>
        )}
        {active === 1 && (
          <Group position="center">
            <Notification
              title="Wait for the buyer to receive the goods"
              disallowClose
            >
              <Text>
                Checking the receipt of the goods takes place inside the
                blockchain.
              </Text>
            </Notification>
            <Button
              disabled={!writeCheckDelivery}
              fullWidth
              size="md"
              my={5}
              variant="light"
              color="teal"
              onClick={() => {
                if (writeCheckDelivery) writeCheckDelivery();
              }}
            >
              Check Delivery
            </Button>
          </Group>
        )}
        {active === 2 && (
          <Group position="center">
            <Notification
              title="The recipient took the goods to the post office"
              disallowClose
            >
              <Text>You can complete the deal and receive money.</Text>
            </Notification>
            <Button
              disabled={!writeComplete}
              fullWidth
              size="md"
              my={5}
              variant="light"
              color="violet"
              onClick={() => {
                if (writeComplete) writeComplete();
              }}
            >
              Complete Deal
            </Button>
          </Group>
        )}
      </Paper>
    </Box>
  );
}
