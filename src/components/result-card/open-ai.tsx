/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { type ChatCompletionRequestMessage } from "openai";
import { useEffect, useMemo, useState } from "react";
import { AuditorAgent } from "~/lib/auditor-agent";
import { useOpenAiKeyStore } from "~/store/open-ai";
import { MarkdownRenderer } from "./markdown-render";

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
  const [history, handlers] = useListState<ChatCompletionRequestMessage>([
    {
      role: "system",
      content:
        "\n    You are a code auditor, your job is to look in to a code and identify any potential vulnerabilities and if possible give a sudgesion for a fix, also you are suppose to explain\n    the code a little bit also if possible, this is a additional thing if you can do that its pretty awsome.  your name is auditor you are the assistant of auditor. auditor is a static code analyzer tool\n    what you mostly do is basically when auditor the code analyzer detects an security vulnerability you are here to provide additional information. when outputing the code I want you to output the code in \n    the below format.  basically <ASSISTANT_RESULT> start with this tag and end with </ASSISTANT_RESULT> tag.  <ASSISTANT_RESULT> is the result of the assistant.  </ASSISTANT_RESULT> is the result of the assistant.",
    },
    {
      role: "user",
      content:
        '\n    below inside the <START_CODE>  </START_CODE> tags it displays the full code file which auditor detected a security vulnerability. \n    <START_CODE>\n    #include <stdio.h>\n#include <string.h>\nint main(){\n    char str[20];\n    strcat(str, "hello world");\n    printf("%s", str);\n    return 0;\n}\n    </START_CODE>\n\n    the specifc line auditor detected the vulnerability is inside the <SPECIFIC_CODE> tag and ends with </SPECIFIC_CODE> tag.\n\n    <SPECIFIC_CODE>\n        strcat(str, "hello world");\n    </SPECIFIC_CODE>\n\n    this was the specific hit auditor identified as a potentioal security vulnerability. auditor found this while looking for matches like this note that match is inside the <MATCH> tag and ends with \n    </MATCH>\n\n    <MATCH> strcat </MATCH>\n    ',
    },
    {
      role: "assistant",
      content:
        '<ASSISTANT_RESULT>\nThe ```c hello``` code above has a buffer overflow vulnerability. The strcat (string concatenate) function concatenates the source string "hello world" to the destination string str, but it appears that the destination string str is not initialized. Thus, the strcat operation will try to append the "hello world" string to the end of whatever string is currently stored in memory at the location of str. This could potentially cause a buffer overflow as there may not be enough space to store the concatenated string.\n\nTo fix this vulnerability, the destination string str should be initialized with a null-terminator before the strcat operation.\n\nFixed code:\n\n#include <stdio.h>\n#include <string.h>\n\nint main(){\n    char str[20] = "";\n    strcat(str, "hello world");\n    printf("%s", str);\n    return 0;\n}\n</ASSISTANT_RESULT>',
    },
    {
      role: "user",
      content: "write a full example for strcat",
    },
    {
      role: "assistant",
      content:
        'Sure! Here is an example of how to use the strcat function in C:\n\n```c \n#include <stdio.h>\n#include <string.h>\n\nint main(){\n    char str1[20] = "Hello";\n    char str2[20] = "world!";\n    \n    strcat(str1, str2); // concatenates str2 to str1\n    \n    printf("%s", str1);\n    return 0;\n}\n```\n\nIn this example, we initialize two character arrays (`str1` and `str2`) with some initial strings. Then we use the `strcat` function to concatenate `str2` to the end of `str1`. Finally, we print the concatenated string using printf. The output of this program would be:\n\n```\nHelloworld!\n```',
    },
  ]);
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
      <div style={{ marginBottom: "10px" }}>
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
          <MarkdownRenderer content={strippedContent} />
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
