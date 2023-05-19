/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Button, Group, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { api } from "~/utils/api";

interface ICreateCommentProps {
  close: () => void;
  resultId: string;
}

export const CreateCommentComponent = ({
  close,
  resultId,
}: ICreateCommentProps) => {
  const [value, setValue] = useState("");
  const mutation = api.results.createComment.useMutation();
  const comemnts = api.results.comments.useQuery({ resultId });

  const createComment = async () => {
    await mutation.mutateAsync({ resultId, comment: value });
    await comemnts.refetch();
    notifications.show({
      title: "Comment created",
      message: "Your comment has been created",
      color: "green",
    });
    close();
  };

  return (
    <Box mt={20}>
      <Textarea
        placeholder="Type here..."
        autosize
        variant="default"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        minRows={2}
        className="comment-box"
        radius="md"
      />
      <Group mt={20}>
        <Button
          variant="white"
          compact
          color="dark"
          onClick={() => createComment()}
          loading={mutation.isLoading}
        >
          post now
        </Button>
        <Button variant="subtle" compact color="dark" onClick={close}>
          close
        </Button>
      </Group>
    </Box>
  );
};
