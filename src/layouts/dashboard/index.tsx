import { useState } from "react";
import {
  AppShell,
  Header,
  MediaQuery,
  Burger,
  useMantineTheme,
  LoadingOverlay,
  Title,
  Group,
  Avatar,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { TeamSwitch } from "~/components/team-switch";
import Link from "next/link";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { data: session, status } = useSession();

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

  if (!session) {
    void Router.push("/auth");
  }

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Group
              position={"apart"}
              style={{
                width: "100%",
              }}
              mx={20}
            >
              <Group>
                <Link href={"/"}>
                  <Title
                    order={4}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    Auditor
                  </Title>
                </Link>

                <TeamSwitch />
              </Group>

              {session?.user && (
                <Avatar src={session.user.image} radius={"lg"} />
              )}
            </Group>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};
