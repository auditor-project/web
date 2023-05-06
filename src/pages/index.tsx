import { Container, TextInput, Title } from "@mantine/core";
import Head from "next/head";
import { DashboardLayout } from "~/layouts/dashboard";
import { StatsGrid } from "~/components/project-card";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { useEffect } from "react";

const data = [
  {
    id: "1234",
    name: "Example Project",
    description: "This is an example project",
    createdAt: "2023-05-05T18:17:41.128Z",
  },
  {
    id: "12345",
    name: "Example Project",
    description: "This is an example project",
    createdAt: "2023-05-05T18:17:41.128Z",
  },
];

const Home = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) {
      void Router.push("/auth");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container size={"xl"}>
          <Title my={20}>Welcome back User</Title>

          <TextInput placeholder="Search..." radius={"sm"} mb={30} size="sm" />
          <StatsGrid data={data} />
        </Container>
      </main>
    </>
  );
};

Home.PageLayout = DashboardLayout;
export default Home;
