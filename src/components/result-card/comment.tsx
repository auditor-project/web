import { createStyles, Text, Avatar, Group, rem, Box } from "@mantine/core";
import { type User } from "@prisma/client";
import { timesAgo } from "~/utils/times-ago";

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: rem(54),
    paddingTop: theme.spacing.sm,
  },
}));

interface CommentSimpleProps {
  id: string;
  createdAt: Date;
  user: User;
  comment: string;
}

export function CommentDetails({
  comment,
  user,
  createdAt,
}: CommentSimpleProps) {
  const { classes } = useStyles();
  return (
    <Box my={20}>
      <Group>
        <Avatar src={user.image} alt={user.name as string} radius="xl" />
        <div>
          <Text size="sm">{user.name}</Text>
          <Text size="xs" color="dimmed">
            {timesAgo(createdAt)}
          </Text>
        </div>
      </Group>
      <Text className={classes.body} size="sm">
        {comment}
      </Text>
    </Box>
  );
}
