import {
  BackgroundImage,
  Box,
  Center,
  List,
  ThemeIcon,
  Image,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons";
import logo from "../assets/logo.png";
import bg from "../assets/bg.png";

export default function Index() {
  return (
    <Box sx={{ maxWidth: "100%" }} mx="auto">
      <Center mt={20} mb={50}>
        <Image src={logo} width={200} />
      </Center>
      <BackgroundImage src={bg} radius="lg">
        <List
          spacing="md"
          p={100}
          size="lg"
          center
          icon={
            <ThemeIcon color="orange" size={24} radius="xl">
              <IconCircleCheck size={16} />
            </ThemeIcon>
          }
        >
          <List.Item>Creation of a delivery service</List.Item>
          <List.Item>Creation of your own marketplace</List.Item>
          <List.Item>Buying a product without trust</List.Item>
          <List.Item>All data is stored on the blockchain</List.Item>
        </List>
      </BackgroundImage>
    </Box>
  );
}
