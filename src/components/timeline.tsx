import { Timeline, Text } from "@mantine/core";
import { type Project } from "@prisma/client";
import {
  IconMessageDots,
  IconPlus,
  IconLoader,
  IconClockPause,
  IconUsers,
} from "@tabler/icons-react";
import { ProjectStatus } from "~/enum/project-status.enum";
import { timesAgo } from "~/utils/times-ago";

const getProjectStatusAsNumber = (status: ProjectStatus): number => {
  switch (status) {
    case ProjectStatus.PENDING:
      return 1;
    case ProjectStatus.QUEUED:
      return 2;
    case ProjectStatus.PROCESSING:
      return 3;
    case ProjectStatus.COMPLETED:
      return 4;
    default:
      return -1;
  }
};

export function TimeLineComponent({ project }: { project: Project }) {
  return (
    <Timeline
      active={getProjectStatusAsNumber(project.currentStatus as ProjectStatus)}
      bulletSize={24}
      lineWidth={2}
    >
      <Timeline.Item
        bullet={<IconPlus size={12} />}
        title="Initiate A New Project"
      >
        <Text color="dimmed" size="sm">
          You&apos;ve created new project{" "}
        </Text>
        <Text size="xs" mt={4}>
          {timesAgo(project.createdAt)}
        </Text>
      </Timeline.Item>

      <Timeline.Item bullet={<IconClockPause size={12} />} title="Pending">
        <Text color="dimmed" size="sm">
          Your task is pending
        </Text>
        <Text size="xs" mt={4}>
          waiting to be picked up
        </Text>
      </Timeline.Item>

      <Timeline.Item bullet={<IconUsers size={12} />} title="Queued">
        <Text color="dimmed" size="sm">
          Your task have been pushed to queue
        </Text>
        <Text size="xs" mt={4}>
          waiting for processing
        </Text>
      </Timeline.Item>

      <Timeline.Item bullet={<IconLoader size={12} />} title="Start Processing">
        <Text color="dimmed" size="sm">
          We have started to process your task
        </Text>
        <Text size="xs" mt={4}>
          we will inform you onces its completed
        </Text>
      </Timeline.Item>

      <Timeline.Item
        bullet={<IconMessageDots size={12} />}
        title="Ready to review
        "
      >
        <Text color="dimmed" size="sm">
          Your code has been processed ready to be reviewd
        </Text>
        <Text size="xs" mt={4}></Text>
      </Timeline.Item>
    </Timeline>
  );
}
