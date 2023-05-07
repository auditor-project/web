/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  createStyles,
  Group,
  Paper,
  SimpleGrid,
  Text,
  rem,
  Avatar,
} from "@mantine/core";
import { Project } from "@prisma/client";
import Link from "next/link";
import { timesAgo } from "~/utils/times-ago";

const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
  },

  value: {
    fontSize: rem(24),
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
  },
}));

export function StatsGrid({ data }: { data: Project[] }) {
  const { classes } = useStyles();

  const getProjectName = (name: string): string => {
    const split = name.split(" ");
    if (split.length >= 2) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return `${split[0][0]}${split[1][0]}`;
    }

    return `${name[0]}${name[1]}`;
  };

  const projects = data.map((project) => {
    return (
      <Paper
        withBorder
        style={{
          backgroundColor: "black",
        }}
        p="md"
        radius="md"
        key={project.id}
        component={Link}
        href={`/${project.id}`}
      >
        <Group position="apart">
          <Text size="md" className={classes.title}>
            {project.name}
          </Text>

          <Avatar radius="xl" color="teal" size={"md"}>
            {getProjectName(project.name)}
          </Avatar>
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>1231</Text>
          <Text color={"teal"} fz="sm" fw={500} className={classes.diff}>
            <span>20%</span>
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={10}>
          {timesAgo(project.createdAt)}
        </Text>
      </Paper>
    );
  });
  return (
    <SimpleGrid
      cols={4}
      breakpoints={[
        { maxWidth: "md", cols: 2 },
        { maxWidth: "xs", cols: 1 },
      ]}
    >
      {projects}
    </SimpleGrid>
  );
}
