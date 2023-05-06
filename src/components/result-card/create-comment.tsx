import { Box, Button, Textarea } from "@mantine/core";

export const CreateCommentComponent = () => {
  return (
    <Box>
      <Textarea
        placeholder="Type here..."
        autosize
        variant="default"
        minRows={2}
        className="comment-box"
        radius="md"
      />
      <Button variant="white" compact color="dark" mt={10}>
        post now
      </Button>
    </Box>
  );
};
