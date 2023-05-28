import { Button, Stack, Text, Title } from "@mantine/core";

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
  return (
    <>
      <Title order={5}>Auditor Assistant</Title>

      <Stack mt={20} mb={20} spacing={"xs"}>
        <Text size={"sm"}>Project path</Text>
        <Text size={"sm"}>Pagegination Limit</Text>
      </Stack>

      <Button variant="outline" color="red" compact onClick={close}>
        Close
      </Button>
    </>
  );
};
