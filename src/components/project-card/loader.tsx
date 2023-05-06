import { Paper, SimpleGrid, Skeleton } from "@mantine/core";

const ProjectSkeleton = () => {
  return (
    <Paper
      withBorder
      style={{
        backgroundColor: "black",
      }}
      p="md"
      radius="md"
    >
      <Skeleton height={50} circle mb="xl" />
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </Paper>
  );
};

export const ProjectCardLoader = () => {
  return (
    <SimpleGrid
      cols={4}
      breakpoints={[
        { maxWidth: "md", cols: 2 },
        { maxWidth: "xs", cols: 1 },
      ]}
    >
      {Array.from(Array(20), (e, i) => {
        return <ProjectSkeleton key={i} />;
      })}
    </SimpleGrid>
  );
};
