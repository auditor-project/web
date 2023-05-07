import {
  Text,
  Container,
  Group,
  Paper,
  Title,
  Stack,
  Grid,
  Accordion,
  rem,
  Button,
  Pagination,
  Box,
  SimpleGrid,
} from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { IconCameraSelfie, IconPhoto, IconPrinter } from "@tabler/icons-react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import {
  InferGetServerSidePropsType,
  type GetServerSidePropsContext,
} from "next";
import { useEffect, useState } from "react";
import SuperJSON from "superjson";
import { ResultCard } from "~/components/result-card";
import { ResultCardLoader } from "~/components/result-card/loader";
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

const AnalysisReport = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [page, onChange] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  const pagination = usePagination({ total: total, page, onChange });
  const { data: project } = api.projects.findById.useQuery({ id });
  const { data: results } = api.results.getResults.useQuery({
    projectId: id,
    skip: page * limit,
    limit: limit,
  });

  useEffect(() => {
    if (results?.count) {
      setTotal(results.count);
    }
    console.log(pagination.range);
  }, [results?.count]);

  return (
    <>
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
              <Title style={{ color: "white" }}>{project?.name}</Title>
              <Text>{project?.description}</Text>
            </Stack>
            <Text> {project?.createdAt.toDateString()}</Text>
          </Group>
        </Paper>

        <Grid grow mt={30}>
          <Grid.Col md={6} lg={3}>
            <Box
              style={{
                position: "sticky",
                top: 100,
                zIndex: 200,
              }}
            >
              <Accordion
                variant="contained"
                style={{
                  backgroundColor: "black",
                }}
              >
                <Accordion.Item value="photos">
                  <Accordion.Control
                    icon={<IconPhoto size={rem(20)} color={"red"} />}
                  >
                    Filetypes
                  </Accordion.Control>
                  <Accordion.Panel>Content</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="print">
                  <Accordion.Control
                    icon={<IconPrinter size={rem(20)} color={"blue"} />}
                  >
                    Severity
                  </Accordion.Control>
                  <Accordion.Panel>Content</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="camera">
                  <Accordion.Control
                    icon={<IconCameraSelfie size={rem(20)} color={"teal"} />}
                  >
                    Matchers
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Button onClick={() => alert(0)}> hi</Button>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>

              <Pagination
                mt={20}
                value={page}
                onChange={onChange}
                total={Math.round(total / limit)}
              />
            </Box>
          </Grid.Col>
          <Grid.Col md={6} lg={9}>
            {results?.results ? (
              <>
                {results.results.map((result) => {
                  return <ResultCard {...result} key={result.id} />;
                })}
              </>
            ) : (
              <>
                {Array.from(Array(20), (e, i) => {
                  return <ResultCardLoader key={i} />;
                })}
              </>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};

AnalysisReport.PageLayout = DashboardLayout;
export default AnalysisReport;
