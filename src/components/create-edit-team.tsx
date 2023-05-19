/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Avatar, Box, Button, Modal, TextInput } from "@mantine/core";
import { api } from "~/utils/api";
import Router from "next/router";
import { MemberSearchModal } from "./member-search";
import { useState } from "react";

interface ICreateOrEditTeam {
  id?: string;
  name: string;
  imageUrl: string;
  description: string;
}

export const CreateOrEditTeam = (props: ICreateOrEditTeam) => {
  const [members, setMembers] = useState<
    {
      id: string;
      name: string;
      image: string;
    }[]
  >([]);
  const upsert = api.teams.upsert.useMutation();
  const handleSubmit = async (values: ICreateOrEditTeam) => {
    await upsert.mutateAsync({
      ...values,
      users: members.map((member) => member.id),
    });

    void Router.push("/");
  };

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      ...props,
    },
  });

  const setNewMember = (member: {
    id: string;
    name: string;
    image: string;
  }) => {
    const ids = new Set(members.map((m) => m.id));
    if (!ids.has(member.id)) {
      setMembers([...members, member]);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} size="lg">
        <MemberSearchModal handleResults={setNewMember} close={close} />
      </Modal>

      <Box>
        <form
          onSubmit={form.onSubmit((values) =>
            handleSubmit({
              ...values,
            })
          )}
        >
          <TextInput
            label="Team name"
            {...form.getInputProps("name")}
            placeholder="team name"
          />
          <TextInput
            label="Team description"
            placeholder="my team is about..."
            mt="md"
            {...form.getInputProps("description")}
          />

          <Avatar.Group spacing="sm" mt={20}>
            {members.map((member) => {
              return (
                <Avatar
                  src={member.image}
                  radius="xl"
                  alt={member.name}
                  key={member.id}
                />
              );
            })}
          </Avatar.Group>

          <Box mt={20}>
            <Button radius="md" compact onClick={open} variant="default">
              Add member
            </Button>
          </Box>

          <Button
            type="submit"
            mt="md"
            variant="white"
            color="dark"
            loading={upsert.isLoading}
          >
            {props.id ? `Update ${props.name}` : "Submit"}
          </Button>
        </form>
      </Box>
    </>
  );
};
