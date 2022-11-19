import { useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Button,
  Box,
  NavLink,
  Alert,
  SimpleGrid,
  Badge,
  Flex,
} from "@mantine/core";
import { Link, Outlet } from "react-router-dom";
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from "wagmi";
import {
  IconAlertCircle,
  IconHome2,
  IconHorseToy,
  IconBuildingStore,
  IconTruckDelivery,
  IconShoppingCart,
  IconCopyright,
} from "@tabler/icons";

export default function Layout() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const { address, isConnected }: any = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector }: any =
    useConnect();

  const { chain } = useNetwork();

  const {
    chains,
    error: errorChain,
    isLoading: isLoadingChain,
    pendingChainId,
    switchNetwork,
  } = useSwitchNetwork();

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Box sx={{ width: "100%" }}>
            <Link to={`/`} style={{ textDecoration: "none" }}>
              <NavLink
                label="Home"
                icon={<IconHome2 size={16} stroke={1.5} />}
              />
            </Link>
            <Link to={`/orders`} style={{ textDecoration: "none" }}>
              <NavLink
                label="Orders"
                icon={<IconHorseToy size={16} stroke={1.5} />}
              />
            </Link>
            <NavLink label="Sellers" childrenOffset={18}>
              <Link to={`/sellers`} style={{ textDecoration: "none" }}>
                <NavLink
                  label="List Sellers"
                  icon={<IconShoppingCart size={16} stroke={1.5} />}
                />
              </Link>
              <Link to={`/sellers/add`} style={{ textDecoration: "none" }}>
                <NavLink
                  label="Add Seller"
                  icon={<IconBuildingStore size={16} stroke={1.5} />}
                />
              </Link>
            </NavLink>
            <NavLink label="Delivery" childrenOffset={18}>
              <Link to={`/delivery/add`} style={{ textDecoration: "none" }}>
                <NavLink
                  label="Add Delivery"
                  icon={<IconTruckDelivery size={16} stroke={1.5} />}
                />
              </Link>
            </NavLink>
          </Box>
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          <SimpleGrid cols={2}>
            <Text>
              <IconCopyright size={14} /> 2022 Qaravan
            </Text>
            <Text style={{ textAlign: "right" }}>
              <Badge color="pink" variant="light" size="lg">
                {chain?.name || "•"}
              </Badge>
            </Text>
          </SimpleGrid>
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Flex
              align="center"
              justify="space-between"
              style={{ width: "100%" }}
            >
              <Text
                variant="gradient"
                gradient={{ from: "red", to: "yellow", deg: 45 }}
                sx={{ fontFamily: "Dosis, sans-serif" }}
                ta="center"
                fz="xl"
                fw={700}
                style={{ margin: 0, padding: 0, fontSize: "40px" }}
              >
                Qaravan
              </Text>

              <Badge color="green" variant="light" size="lg">
                {address
                  ? address?.slice(0, 4) +
                    ".." +
                    address?.slice(address.length - 2, address.length)
                  : "•"}
              </Badge>
            </Flex>
          </div>
        </Header>
      }
    >
      {isConnected ? (
        chain?.unsupported ? (
          <Box style={{ margin: "150px auto" }}>
            <SimpleGrid style={{ width: "50%", margin: "auto" }}>
              <SimpleGrid cols={2}>
                {chains.map((x) => (
                  <Button
                    fullWidth
                    mt={5}
                    color="yellow"
                    variant="light"
                    uppercase
                    disabled={!switchNetwork || x.id === chain?.id}
                    key={x.id}
                    onClick={() => switchNetwork?.(x.id)}
                    size="xl"
                  >
                    {x.name}
                    {isLoadingChain &&
                      pendingChainId === x.id &&
                      " (switching)"}
                  </Button>
                ))}
              </SimpleGrid>

              {errorChain && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Ooups!"
                  color="red"
                  my={10}
                >
                  {errorChain.message}
                </Alert>
              )}
            </SimpleGrid>
          </Box>
        ) : (
          <Outlet />
        )
      ) : (
        <Box style={{ margin: "150px auto" }}>
          <SimpleGrid style={{ width: "50%", margin: "auto" }}>
            <SimpleGrid cols={2}>
              {connectors.map((connector: any) => (
                <Button
                  fullWidth
                  mt={5}
                  color="yellow"
                  variant="light"
                  uppercase
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  size="xl"
                >
                  {connector.name}
                  {!connector.ready && " (unsupported)"}
                  {isLoading &&
                    connector.id === pendingConnector?.id &&
                    " (connecting)"}
                </Button>
              ))}
            </SimpleGrid>

            {error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Ooups!"
                color="red"
                my={10}
              >
                {error.message}
              </Alert>
            )}
          </SimpleGrid>
        </Box>
      )}
    </AppShell>
  );
}
