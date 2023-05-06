import { Container, Group, Text, Paper, Stack, Title } from "@mantine/core";
import { CreateOrEditProject } from "~/components/create-edit-project";
import { ProjectStatus } from "~/enum/project-status.enum";
import { DashboardLayout } from "~/layouts/dashboard";
import { useTeamStore } from "~/store/team-store";

const NewProjectInit = () => {
  const { teamId } = useTeamStore();
  const initialValues = {
    name: "",
    teamId: teamId as string,
    description: "",
    currentStatus: ProjectStatus.PENDING,
  };
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
            <Title style={{ color: "white" }}>Create Project</Title>
            <Text>Create a project to get start analysis</Text>
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
        <CreateOrEditProject {...initialValues} />
      </Paper>
    </Container>
  );
};

NewProjectInit.PageLayout = DashboardLayout;
export default NewProjectInit;
