/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Avatar, Box, Button, Modal, TextInput } from "@mantine/core";
import { api } from "~/utils/api";
import Router from "next/router";

interface ICreateOrProject {
  id?: string;
  name: string;
  teamId: string;
  description: string;
  currentStatus: string;
}

export const CreateOrEditProject = (props: ICreateOrProject) => {
  const upsert = api.projects.upsert.useMutation();
  const handleSubmit = async (values: ICreateOrProject) => {
    await upsert.mutateAsync({
      ...values,
    });

    void Router.push("/");
  };

  const form = useForm({
    initialValues: {
      ...props,
    },
  });

  return (
    <>
      <Box>
        <form
          onSubmit={form.onSubmit((values) =>
            handleSubmit({
              ...values,
            })
          )}
        >
          <TextInput
            label="project name"
            {...form.getInputProps("name")}
            placeholder="team name"
          />
          <TextInput
            label="project description"
            placeholder="my project is about..."
            mt="md"
            {...form.getInputProps("description")}
          />

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
