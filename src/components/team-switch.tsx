import { Avatar, Text, Group, ActionIcon, Menu } from "@mantine/core";
import { Team } from "@prisma/client";
import {
  IconCheck,
  IconDropletDown,
  IconPlus,
  IconSelector,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import { useTeamStore } from "~/store/team-store";
import { api } from "~/utils/api";

const TeamDetailsComponent = (team: Team) => {
  const { teamId } = useTeamStore();

  return (
    <Group position="apart">
      <Text>{team.name}</Text>

      {team.id === teamId && (
        <ActionIcon>
          <IconCheck size="1.125rem" />
        </ActionIcon>
      )}
    </Group>
  );
};

export const TeamSwitch = () => {
  const { setTeamId, teamId } = useTeamStore();
  const teams = api.teams.myTeams.useQuery();
  const currentTeam = api.teams.byId.useQuery({ id: teamId as string });

  return (
    <Menu shadow="md" width={300}>
      <Menu.Target>
        <Group>
          <Avatar radius="xl">{currentTeam.data?.name[0]}</Avatar>
          <Text>{currentTeam.data?.name}</Text>
          <ActionIcon>
            <IconSelector size="1.125rem" />
          </ActionIcon>
        </Group>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Teams</Menu.Label>
        {teams.data && (
          <>
            {teams.data?.map((team) => {
              return (
                <>
                  <Menu.Item
                    icon={<Avatar radius="xl">{team.name[0]}</Avatar>}
                    key={team.id}
                    onClick={() => setTeamId(team.id)}
                  >
                    <TeamDetailsComponent {...team} />
                  </Menu.Item>
                  <Menu.Divider />
                </>
              );
            })}
          </>
        )}

        <Menu.Label>Actions</Menu.Label>
        <Menu.Item icon={<IconPlus size={14} />}>
          <Link href={"/create-team"}>Create Team</Link>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
