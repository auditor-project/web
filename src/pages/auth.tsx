/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Text,
  Paper,
  Stack,
  Container,
  type PaperProps,
  LoadingOverlay,
} from "@mantine/core";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  GithubButton,
  GoogleButton,
  TwitterButton,
} from "~/components/social-buttons";

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
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <LoadingOverlay
        visible={true}
        overlayBlur={2}
        overlayOpacity={0.3}
        overlayColor="black"
      />
    );
  }

  if (session) {
    // Redirect the user to the homepage if they are already authenticated
    void router.push("/");
    return null;
  }

  return (
    <Container size={"xs"}>
      <AuthenticationForm mt={100} />
    </Container>
  );
};

export default AuthPage;
