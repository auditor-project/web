import {
  createStyles,
  Group,
  Paper,
  SimpleGrid,
  Text,
  rem,
  Avatar,
} from "@mantine/core";
import {
  IconUserPlus,
  IconDiscount2,
  IconReceipt2,
  IconCoin,
  IconArrowUpRight,
  IconArrowDownRight,
  IconInfoSmall,
} from "@tabler/icons-react";

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

interface IProjectDetails {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const timesAgo = (date: Date): string => {
  const now = new Date();
  const delta = now.getTime() - date.getTime();

  if (delta < 60000) {
    return "just now";
  } else if (delta < 3600000) {
    const minutes = Math.floor(delta / 60000);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (delta < 86400000) {
    const hours = Math.floor(delta / 3600000);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    const days = Math.floor(delta / 86400000);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
};

export function StatsGrid({ data }: { data: IProjectDetails[] }) {
  const { classes } = useStyles();
  const stats = data.map((stat) => {
    return (
      <Paper withBorder p="md" radius="md" key={stat.id}>
        <Group position="apart">
          <Text size="md" className={classes.title}>
            {stat.name}
          </Text>

          <Avatar radius="xl" color="teal" size={"md"}>
            EP
          </Avatar>
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>1231</Text>
          <Text color={"teal"} fz="sm" fw={500} className={classes.diff}>
            <span>20%</span>
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={10}>
          {timesAgo(new Date(stat.createdAt))}
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
      {stats}
    </SimpleGrid>
  );
}
