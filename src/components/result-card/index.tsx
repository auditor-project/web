import { Badge, Box, Button, Group, Paper, Stack, Text } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { type Language } from "prism-react-renderer";
import { CommentDetails } from "./comment";
import { CreateCommentComponent } from "./create-comment";
import { useDisclosure } from "@mantine/hooks";

const comment = {
  postedAt: "10 minutes ago",
  body: "This Pokémon likes to lick its palms that are sweetened by being soaked in honey. Teddiursa concocts its own honey by blending fruits and pollen collected by Beedrill. Blastoise has water spouts that protrude from its shell. The water spouts are very accurate.",
  author: {
    name: "Jacob Warnhalter",
    image:
      "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
  },
};

interface IResultCardProps {
  id: number;
  file: string;
  filetype: string;
  search: string;
  match_str: string;
  hits: string;
  line: number;
  code: (string | number | boolean)[][];
  severity: string;
}

const generateCode = (code: (string | number | boolean)[][]) => {
  const codelines: string[] = [];
  // eslint-disable-next-line prefer-const
  let highlightLines: { color: string }[] = [];

  code.forEach((line, index) => {
    codelines.push(line[1] as string);
    if (line[2] == true) {
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

export const ResultCard = (props: IResultCardProps) => {
  const { code, lines } = generateCode(props.code);
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Paper
      shadow="md"
      withBorder
      sx={{ backgroundColor: "black" }}
      p={15}
      mb={20}
    >
      <Stack>
        <Group position="apart">
          <Text size={"lg"}> {props.match_str}</Text>
          <Badge color={getSeverityColor(props.severity)}>
            {props.severity}
          </Badge>
        </Group>
        <Text>
          {props.file}:<span style={{ color: "green" }}>{props.line}</span>
        </Text>
      </Stack>

      <Prism.Tabs defaultValue={props.file.split("/").slice(-1)[0]} mt={20}>
        <Prism.TabsList>
          <Prism.Tab value={props.file.split("/").slice(-1)[0] as string}>
            {props.file.split("/").slice(-1)[0]}
          </Prism.Tab>
        </Prism.TabsList>

        <Prism.Panel
          language={props.filetype as Language}
          withLineNumbers
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          highlightLines={lines}
          value={props.file.split("/").slice(-1)[0] as string}
        >
          {code}
        </Prism.Panel>
      </Prism.Tabs>

      <Box>
        <CommentDetails {...comment} />
        <CommentDetails {...comment} />
        <CommentDetails {...comment} />
        <CommentDetails {...comment} />
      </Box>

      {opened && <CreateCommentComponent />}
      {!opened && (
        <Button variant="light" color="gray" compact onClick={open}>
          Add comment
        </Button>
      )}
    </Paper>
  );
};
