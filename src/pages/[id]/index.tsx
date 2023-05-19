/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import Link from "next/link";
import SuperJSON from "superjson";
import { TimeLineComponent } from "~/components/timeline";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { DashboardLayout } from "~/layouts/dashboard";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: SuperJSON,
  });

  const id = context.params?.id as string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const projectExists = await helpers.projects.exists.fetch({ id });

  if (projectExists) {
    await helpers.projects.findById.prefetch({ id });
  } else {
    // if post doesn't exist, return 404
    return {
      props: { id },
      notFound: true,
    };
  }
  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
}

const AnalysisDetailsPage = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data } = api.projects.findById.useQuery({ id });

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
            <Title style={{ color: "white" }}>{data?.name}</Title>
            <Button
              variant="white"
              color="dark"
              component={Link}
              href={`/${data?.id}/analysis`}
            >
              Analysis Response
            </Button>
          </Group>
        </Paper>
      </Container>
      <Container size={"xl"}>
        <Stack mt={30}>
          <Title order={3}>Analysis Information</Title>
          <Text>{data?.description}</Text>
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
            {data && <TimeLineComponent project={data} />}
          </Group>
        </Paper>
      </Container>
    </>
  );
};

AnalysisDetailsPage.PageLayout = DashboardLayout;
export default AnalysisDetailsPage;
