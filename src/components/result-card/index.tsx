/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Badge,
  Box,
  Button,
  Group,
  Loader,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import { type Language } from "prism-react-renderer";
import { CommentDetails } from "./comment";
import { CreateCommentComponent } from "./create-comment";
import { useDisclosure } from "@mantine/hooks";
import { type Comments, Prisma, Results, User } from "@prisma/client";
import { api } from "~/utils/api";
import { useFilePathStore } from "~/store/file-path";
import { useEffect, useState } from "react";
import { stat } from "fs";
import { useOpenAiKeyStore } from "~/store/open-ai";
import { OpenAiComponent } from "./open-ai";

const comment = {
  postedAt: "10 minutes ago",
  body: "This Pokémon likes to lick its palms that are sweetened by being soaked in honey. Teddiursa concocts its own honey by blending fruits and pollen collected by Beedrill. Blastoise has water spouts that protrude from its shell. The water spouts are very accurate.",
  author: {
    name: "Jacob Warnhalter",
    image:
      "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
  },
};

const generateCode = (code: Prisma.JsonValue) => {
  const codelines: string[] = [];
  // eslint-disable-next-line prefer-const
  let highlightLines: { color: string }[] = [];
  const results = code as unknown as (string | number | boolean)[][];

  results.forEach((line, index) => {
    codelines.push(line[1] as string);
    if (line[2]) {
      highlightLines[index + 1] = {
        color: "yellow",
      };
    }
  });

  return {
    code: codelines.join("\n"),
    lines: highlightLines,
  };
};

const getSeverityColor = (level: string) => {
  if (level == "high") return "red";
  if (level == "medium") return "yellow";
  if (level == "low") return "green";
  return "gray";
};

export const ResultCard = (result: Results) => {
  const { code, lines } = generateCode(result.code);
  const [severity, setSeverity] = useState<string | null>(result.severity);
  const [opened, { open, close }] = useDisclosure(false);
  const [showOpenAi, { open: openAiShow, close: openAiClose }] =
    useDisclosure(false);
  const { path } = useFilePathStore();
  const { key } = useOpenAiKeyStore();

  const comments = api.results.comments.useQuery({
    resultId: result.id,
  });
  const severityUpdate = api.results.updateSeverity.useMutation();

  const openInCode = (file: string) => {
    window.open(`vscode://file${file}`);
  };

  const updateSetSeverity = async (status: string | null) => {
    if (status) {
      await severityUpdate.mutateAsync({
        resultId: result.id,
        status,
      });

      setSeverity(status);
    }
  };

  return (
    <>
      <Modal
        opened={showOpenAi}
        onClose={openAiClose}
        withCloseButton={false}
        centered
        size={"lg"}
      >
        {result && (
          <OpenAiComponent
            close={openAiClose}
            code={code}
            match={result.matchStr}
            hits={result.hits}
            search={result.search}
          />
        )}
      </Modal>

      <Paper
        shadow="md"
        withBorder
        sx={{ backgroundColor: "black" }}
        p={15}
        mb={20}
      >
        <Stack>
          <Group position="apart">
            <Stack>
              <Text size={"lg"}> {result.matchStr}</Text>
              {severityUpdate.isLoading ? (
                <Loader size="sm" />
              ) : (
                <Badge
                  color={getSeverityColor(severity ? severity : "not-marked")}
                >
                  {severity}
                </Badge>
              )}
            </Stack>

            <Select
              value={severity}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onChange={updateSetSeverity}
              data={[
                { value: "not-marked", label: "Not Marked" },
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
            />
          </Group>

          <Text
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              openInCode(
                `${path ? path : ""}/${result.file.split("/").at(-1)}`
              );
            }}
          >
            {path}
            {result.file.split("/").at(-1)}:
            <span style={{ color: "green" }}>{result.line}</span>
          </Text>

          {key && (
            <Button
              variant="light"
              color="gray"
              compact
              onClick={openAiShow}
              style={{ width: 100 }}
            >
              Ask OpenAi
            </Button>
          )}
        </Stack>

        <Prism.Tabs defaultValue={result.file.split("/").slice(-1)[0]} mt={20}>
          <Prism.TabsList>
            <Prism.Tab value={result.file.split("/").slice(-1)[0] as string}>
              {result.file.split("/").slice(-1)[0]}
            </Prism.Tab>
          </Prism.TabsList>

          <Prism.Panel
            language={result.filetype as Language}
            withLineNumbers
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            highlightLines={lines}
            value={result.file.split("/").slice(-1)[0] as string}
          >
            {code}
          </Prism.Panel>
        </Prism.Tabs>

        <Box>
          {comments.isLoading && <Text>Loading...</Text>}
          {comments.data && (
            <>
              {comments.data.map((comment) => {
                return <CommentDetails {...comment} key={comment.id} />;
              })}
            </>
          )}
        </Box>

        {opened && (
          <CreateCommentComponent close={close} resultId={result.id} />
        )}
        {!opened && (
          <Button variant="light" color="gray" compact onClick={open} mt={20}>
            Add comment
          </Button>
        )}
      </Paper>
    </>
  );
};
