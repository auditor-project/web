/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Button,
  Container,
  Grid,
  Paper,
  Skeleton,
  TextInput,
  Title,
} from "@mantine/core";
import Head from "next/head";
import { DashboardLayout } from "~/layouts/dashboard";
import { StatsGrid } from "~/components/project-card";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { useTeamStore } from "~/store/team-store";
import { ProjectCardLoader } from "~/components/project-card/loader";
import Link from "next/link";

const data = [
  {
    id: "1234",
    name: "Example Project",
    description: "This is an example project",
    createdAt: "2023-05-05T18:17:41.128Z",
  },
  {
    id: "12345",
    name: "Example Project",
    description: "This is an example project",
    createdAt: "2023-05-05T18:17:41.128Z",
  },
];

const Home = () => {
  const { data: session } = useSession();
  const teams = api.teams.myTeams.useQuery();
  const { setTeamId, teamId } = useTeamStore();

  useEffect(() => {
    if (teams.data) {
      if (teams.data.length == 0) {
        void Router.push("/create-team");
        return;
      }

      if (!teamId) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setTeamId(teams.data[0]?.id);
      }
    }
  }, [teams.data]);

  const projects = api.projects.projects.useQuery({
    teamId: teamId as string,
  });

  return (
    <>
      <Head>
        <title>Auditor | Dashboard</title>
        <meta
          name="description"
          content="Auditor is a source code analyzing application"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container size={"xl"}>
          <Title my={20}>Welcome back {session?.user.name as string}</Title>

          <Grid grow mb={30}>
            <Grid.Col span={10}>
              <TextInput placeholder="Search..." radius={"sm"} size="sm" />
            </Grid.Col>
            <Grid.Col span={2}>
              <Button
                variant="white"
                fullWidth
                color="dark"
                component={Link}
                href={"/new"}
              >
                Add New
              </Button>
            </Grid.Col>
          </Grid>

          {projects.isLoading && <ProjectCardLoader />}
          {projects.data && <StatsGrid data={projects.data} />}
        </Container>
      </main>
    </>
  );
};

Home.PageLayout = DashboardLayout;
export default Home;
