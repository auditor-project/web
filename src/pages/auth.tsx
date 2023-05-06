/* eslint-disable @typescript-eslint/no-misused-promises */
import { Text, Paper, Stack, Container, type PaperProps } from "@mantine/core";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import {
  GithubButton,
  GoogleButton,
  TwitterButton,
} from "~/components/social-buttons";
import Router from "next/router";

function AuthenticationForm(props: PaperProps) {
  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500} style={{ color: "white" }}>
        Welcome to Auditor, continue with
      </Text>

      <Stack mt={30}>
        <GoogleButton onClick={() => signIn("google")}>Google</GoogleButton>
        <TwitterButton onClick={() => signIn("twitter")}>Twitter</TwitterButton>
        <GithubButton onClick={() => signIn("github")}>Github</GithubButton>
      </Stack>
    </Paper>
  );
}

const AuthPage = () => {
  return (
    <Container size={"xs"}>
      <AuthenticationForm mt={100} />
    </Container>
  );
};

export default AuthPage;
