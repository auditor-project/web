/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { type ChatCompletionRequestMessage } from "openai";
import { useEffect, useMemo, useState } from "react";
import { AuditorAgent } from "~/lib/auditor-agent";
import { useOpenAiKeyStore } from "~/store/open-ai";

interface IOpenAiComponentProps {
  close: () => void;
  code: string;
  match: string;
  search: string;
  hits: string;
}

export const OpenAiComponent = ({
  close,
  code,
  match,
  search,
  hits,
}: IOpenAiComponentProps) => {
  const { key } = useOpenAiKeyStore();
  const [value, setValue] = useState("");
  const [started, setStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [history, handlers] = useListState<ChatCompletionRequestMessage>([]);
  const agent = useMemo(() => {
    return new AuditorAgent({
      key: key as string,
      code,
      match,
      search,
      hits,
      history,
      handlers,
      setIsLoading,
    });
  }, [key, code, match, search, hits, history, handlers, setIsLoading]);
  const theme = useMantineTheme();

  const renderAssistantMessage = (content: string) => {
    // Strip out <ASSISTANT_RESULT> and </ASSISTANT_RESULT> tags
    const strippedContent = content.replace(/<\/?ASSISTANT_RESULT>/g, "");

    return (
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <Paper
          p="xs"
          shadow="xs"
          radius="md"
          style={{
            marginLeft: 100,
            backgroundColor:
              theme.colorScheme === "dark" ? "#007AFF" : "#DCF8C6",
            color: theme.colorScheme === "dark" ? "white" : "black",
          }}
        >
          {strippedContent}
        </Paper>
      </div>
    );
  };

  const renderUserMessage = (content: string) => (
    <div style={{ textAlign: "left", marginBottom: "10px" }}>
      <Paper
        p="sm"
        shadow="xs"
        radius="md"
        style={{
          marginRight: 100,
          backgroundColor: theme.colorScheme === "dark" ? "#1F2937" : "#F3F4F6",
          color: theme.colorScheme === "dark" ? "white" : "black",
        }}
      >
        {content}
      </Paper>
    </div>
  );

  useEffect(() => {
    if (history.length === 0) {
      const systemPrompt = agent.generateSystemPrompt();
      const startPrompt = agent.generateStartPrompt();

      handlers.setState([
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: startPrompt,
        },
      ]);
    }
  }, []);

  return (
    <>
      <Title order={5} mb={30}>
        Auditor Assistant
      </Title>

      {history.map((history, index) => {
        if (history.role === "system") {
          return null; // Skip system messages
        }

        if (history.role === "assistant") {
          return renderAssistantMessage(history.content);
        }
        if (history.role === "user" && index === 1) {
          return null;
        }

        return renderUserMessage(history.content);
      })}

      {isLoading && <Loader variant="dots" />}

      {started && (
        <Stack mt={20} mb={20} spacing={"xs"}>
          <Textarea
            placeholder="Your comment"
            label="Ask OpenAi"
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
          />
          <Button
            variant="default"
            disabled={history.length == 0}
            compact
            onClick={() => {
              void agent.addUserQuestion(value);
              setValue("");
            }}
            style={{
              width: "30%",
            }}
          >
            Send
          </Button>
        </Stack>
      )}

      <Group mt={30}>
        <Button variant="outline" color="red" compact onClick={close}>
          Close
        </Button>

        {!started && (
          <Button
            variant="outline"
            color="green"
            disabled={history.length == 0}
            compact
            onClick={() => {
              setStarted(true);
              void agent.start();
            }}
          >
            start
          </Button>
        )}
      </Group>
    </>
  );
};
