/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  Center,
  Group,
  RingProgress,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { api } from "~/utils/api";
import Router from "next/router";
import useFileUploader from "~/hooks/image-uploader";
import { Dropzone, type FileWithPath } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useState } from "react";
import axios from "axios";
import { notifications } from "@mantine/notifications";

interface ICreateOrProject {
  id?: string;
  name: string;
  teamId: string;
  description: string;
  currentStatus: string;
  signatureFile: string;
}

export const CreateOrEditProject = (props: ICreateOrProject) => {
  const upsert = api.projects.upsert.useMutation();
  const [isUploading, setIsUploading] = useState(false);
  const { uploadStatus, handleUpload, uploadProgress } = useFileUploader();

  const handleSubmit = async (values: ICreateOrProject) => {
    if (!uploadStatus.uploadKey) {
      notifications.show({
        title: "Error",
        message: "Please upload the source code",
        color: "red",
      });
      return;
    }

    if (uploadStatus.status != "success") {
      notifications.show({
        title: "Error",
        message: "Please wait untill your files are uploaded",
        color: "red",
      });
      return;
    }

    await upsert.mutateAsync({
      ...values,
      sourceCodeUrl: uploadStatus.uploadKey,
    });

    void Router.push("/");
  };

  const handleFileUpload = async (
    file: FileWithPath | undefined,
    action: string
  ) => {
    setIsUploading(true);
    if (!file) {
      return;
    }
    const response = await axios.post("/api/presigned-url", {
      fileName: file.name,
      action,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await handleUpload(file, response.data);

    setIsUploading(false);
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

          {isUploading ? (
            <Center mt={50}>
              <RingProgress
                sections={[{ value: uploadProgress, color: "blue" }]}
                label={
                  <Text align="center">{Math.round(uploadProgress)}%</Text>
                }
              />
            </Center>
          ) : (
            <Dropzone
              onDrop={(files) => handleFileUpload(files[0], "code")}
              multiple={false}
              onReject={(files) => console.log("rejected files", files)}
              maxSize={3221225472}
              accept={["application/zip"]}
              mt={30}
              style={{
                backgroundColor: "black",
              }}
            >
              <Group
                position="center"
                spacing="xl"
                style={{ minHeight: rem(220), pointerEvents: "none" }}
              >
                <Dropzone.Accept>
                  <IconUpload size="3.2rem" stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size="3.2rem" stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size="3.2rem" stroke={1.5} />
                </Dropzone.Idle>

                <div>
                  <Text size="xl" inline>
                    Dark and drop or click here
                  </Text>
                  <Text size="sm" color="dimmed" inline mt={7}>
                    You can upload the source code here, only zip is supported
                  </Text>
                </div>
              </Group>
            </Dropzone>
          )}
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
