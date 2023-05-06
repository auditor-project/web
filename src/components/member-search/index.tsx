/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Button, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { api } from "~/utils/api";

interface IMemberSearchModalProps {
  handleResults: (member: { id: string; name: string; image: string }) => void;
  close: () => void;
}

export const MemberSearchModal = ({
  handleResults,
  close,
}: IMemberSearchModalProps) => {
  const [value, setValue] = useState("");
  const members = api.teams.searchMembers.useMutation();

  const addMember = async () => {
    const data = await members.mutateAsync({
      email: value,
    });
    if (!data) {
      notifications.show({
        title: "Error",
        message: "user not found",
        color: "red",
      });

      close();
      return;
    }

    handleResults({
      image: data.image as string,
      name: data.name as string,
      id: data.id,
    });

    close();
    notifications.show({
      title: "success",
      message: `${data.name} added to the team successfully`,
      color: "green",
    });
  };

  return (
    <Box>
      <TextInput
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        placeholder="user@example.com"
        label="user email"
      />
      <Button
        variant="default"
        color="gray"
        compact
        mt={10}
        onClick={() => addMember()}
        loading={members.isLoading}
      >
        Add Member
      </Button>
    </Box>
  );
};
