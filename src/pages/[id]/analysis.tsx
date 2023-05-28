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
  Modal,
  ActionIcon,
  TextInput,
  NumberInput,
  List,
  PasswordInput,
  Switch,
  Checkbox,
} from "@mantine/core";
import { randomId, useDisclosure, usePagination } from "@mantine/hooks";
import {
  IconCameraSelfie,
  IconKey,
  IconPhoto,
  IconPrinter,
  IconRoad,
  IconSettings,
} from "@tabler/icons-react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import {
  type InferGetServerSidePropsType,
  type GetServerSidePropsContext,
} from "next";
import { useEffect, useState } from "react";
import SuperJSON from "superjson";
import { ResultCard } from "~/components/result-card";
import { ResultCardLoader } from "~/components/result-card/loader";
import { DashboardLayout } from "~/layouts/dashboard";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { useVisibilityStore } from "~/store/code-visibility";
import { useFilePathStore } from "~/store/file-path";
import { useOpenAiKeyStore } from "~/store/open-ai";
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

const SeverityFilterData = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "ignored", label: "Ignore" },
  { value: "not-marked", label: "Not Marked" },
];

const AnalysisReport = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [page, onChange] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const { path, setFilePath } = useFilePathStore();
  const { key, setKey } = useOpenAiKeyStore();
  const { count, setVisibility } = useVisibilityStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [severityFilter, setSeverityFilter] = useState<Array<string>>([
    "not-marked",
    "ignored",
    "low",
    "medium",
    "high",
  ]);

  const handleChangeSeverityFilter = (value: string) => {
    setSeverityFilter((prevSelectedValues) => {
      if (prevSelectedValues.includes(value)) {
        return prevSelectedValues.filter((v) => v !== value);
      } else {
        return [...prevSelectedValues, value];
      }
    });
  };

  const onChangePaginiation = (val: number) => {
    onChange(val - 1);
  };

  const pagination = usePagination({ total: total, page, onChange });
  const { data: project } = api.projects.findById.useQuery({ id });
  const { data: results } = api.results.getResults.useQuery({
    projectId: id,
    skip: page * limit,
    limit: limit,
    severityFilter: severityFilter,
  });
  const { data: analytics } = api.results.getAnalytics.useQuery({
    projectId: id,
  });

  useEffect(() => {
    if (results?.count) {
      setTotal(results.count);
    }
    console.log(pagination.range);
  }, [pagination.range, results]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        size={"lg"}
      >
        <Title order={5}>Configure project</Title>

        <Stack mt={20} mb={20} spacing={"xs"}>
          <Text size={"sm"}>Project path</Text>
          <TextInput
            placeholder="this will be used to open in code"
            icon={<IconRoad size="0.8rem" />}
            value={path}
            onChange={(event) => setFilePath(event.currentTarget.value)}
          />

          <Text size={"sm"}>Pagegination Limit</Text>
          <NumberInput
            value={limit}
            onChange={(val: number) => setLimit(val)}
            placeholder="pagination limit"
            withAsterisk
          />

          <Text size={"sm"}>Code Visibility</Text>
          <NumberInput
            value={count}
            onChange={(val: number) => setVisibility(val)}
            placeholder="Code visibility"
            description="number of lines to show in code block from hit and after hit"
            withAsterisk
          />

          <Text size={"sm"}>OpenAI API Key</Text>
          <PasswordInput
            description="OpenAI Api key is required to enable auditor assistant"
            placeholder="OpenAI key"
            icon={<IconKey size="0.8rem" />}
            value={key}
            onChange={(event) => setKey(event.currentTarget.value)}
          />
        </Stack>

        <Button variant="outline" color="red" compact onClick={close}>
          Close
        </Button>
      </Modal>

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

              <ActionIcon onClick={open}>
                <IconSettings size="1.125rem" />
              </ActionIcon>
            </Stack>
            <Stack>
              <Text> {project?.createdAt.toDateString()}</Text>
            </Stack>
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
                <Accordion.Item value="fileTypes">
                  <Accordion.Control
                    icon={<IconPhoto size={rem(20)} color={"red"} />}
                  >
                    Filetypes
                  </Accordion.Control>
                  <Accordion.Panel>
                    <List>
                      {analytics?.fileTypes.map((filetype) => {
                        return (
                          <List.Item key={randomId()}>
                            {filetype.type} - {filetype.count}
                          </List.Item>
                        );
                      })}
                    </List>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="print">
                  <Accordion.Control
                    icon={<IconPrinter size={rem(20)} color={"blue"} />}
                  >
                    Severity
                  </Accordion.Control>
                  <Accordion.Panel>
                    <List>
                      {analytics?.severity.map((severity) => {
                        return (
                          <List.Item key={randomId()}>
                            {severity.type} - {severity.total}
                          </List.Item>
                        );
                      })}
                    </List>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="camera">
                  <Accordion.Control
                    icon={<IconCameraSelfie size={rem(20)} color={"teal"} />}
                  >
                    Matchers
                  </Accordion.Control>
                  <Accordion.Panel>
                    <List>
                      {analytics?.hits.map((hit) => {
                        return (
                          <List.Item key={randomId()}>
                            {hit.type} - {hit.count}
                          </List.Item>
                        );
                      })}
                    </List>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>

              <NumberInput
                value={count}
                onChange={(val: number) => setVisibility(val)}
                label="Code visibility"
                my={20}
                placeholder="Code visibility"
                description="number of lines to show in code block from hit and after hit"
              />

              {SeverityFilterData.map((filter) => (
                <Checkbox
                  key={filter.value}
                  checked={severityFilter.includes(filter.value)}
                  onChange={() => handleChangeSeverityFilter(filter.value)}
                  label={filter.label}
                  mt={10}
                />
              ))}

              <Pagination
                mt={30}
                value={page + 1}
                onChange={onChangePaginiation}
                total={Math.round(total / limit) + 1}
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
