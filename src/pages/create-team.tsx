import {
  Text,
  Container,
  Group,
  Paper,
  Stack,
  Title,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { CreateOrEditTeam } from "~/components/create-edit-team";
import { DashboardLayout } from "~/layouts/dashboard";

const initialValues = {
  name: "",
  description: "",
  imageUrl: "",
};

const CreateTeamPage = () => {
  return (
    <Container size="xl">
      <Paper
        shadow="md"
        withBorder
        sx={{ backgroundColor: "black" }}
        p={25}
        mt={10}
      >
        <Group position="apart">
          <Stack>
            <Title style={{ color: "white" }}>Create Team</Title>
            <Text>Create a new team and add members to the team</Text>
          </Stack>
        </Group>
      </Paper>

      <Paper
        shadow="md"
        withBorder
        sx={{ backgroundColor: "black" }}
        p={25}
        mt={20}
      >
        <CreateOrEditTeam {...initialValues} />
      </Paper>
    </Container>
  );
};

CreateTeamPage.PageLayout = DashboardLayout;
export default CreateTeamPage;
