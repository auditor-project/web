import { Paper, Skeleton, Stack } from "@mantine/core";

export const ResultCardLoader = () => {
  return (
    <Paper
      shadow="md"
      withBorder
      sx={{ backgroundColor: "black" }}
      p={15}
      mb={20}
    >
      <Stack>
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </Stack>

      <Skeleton height={200} mt={20} mb={20} />

      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </Paper>
  );
};
