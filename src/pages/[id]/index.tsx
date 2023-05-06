import {
  Text,
  Button,
  Container,
  Group,
  Paper,
  Title,
  Stack,
  Avatar,
} from "@mantine/core";
import Link from "next/link";
import { TimeLineComponent } from "~/components/timeline";
import { DashboardLayout } from "~/layouts/dashboard";

const data = {
  id: "1234",
  name: "Example Project",
  description: "This is an example project",
  createdAt: "2023-05-05T18:17:41.128Z",
};

const AnalysisDetailsPage = () => {
  return (
    <>
      <Container size="xl">
        <Paper
          shadow="md"
          withBorder
          sx={{ backgroundColor: "black" }}
          p={40}
          mt={20}
        >
          <Group position="apart">
            <Title style={{ color: "white" }}>{data.name}</Title>
            <Button
              variant="white"
              color="dark"
              component={Link}
              href={"/1234/analysis"}
            >
              Analysis Response
            </Button>
          </Group>
        </Paper>
      </Container>
      <Container size={"xl"}>
        <Stack mt={30}>
          <Title order={3}>Analysis Information</Title>
          <Text>{data.description}</Text>
          <Avatar.Group spacing="sm">
            <Avatar src="image.png" radius="xl" />
            <Avatar src="image.png" radius="xl" />
            <Avatar src="image.png" radius="xl" />
            <Avatar radius="xl">+5</Avatar>
          </Avatar.Group>
        </Stack>

        <Paper
          shadow="md"
          withBorder
          mt={30}
          sx={{ backgroundColor: "black" }}
          p={40}
        >
          <Group position="apart">
            <TimeLineComponent />
          </Group>
        </Paper>
      </Container>
    </>
  );
};

AnalysisDetailsPage.PageLayout = DashboardLayout;
export default AnalysisDetailsPage;
