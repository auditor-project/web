import {
  Text,
  Container,
  Group,
  Paper,
  Title,
  Stack,
  Grid,
  Box,
  useMantineTheme,
  Accordion,
  rem,
  Button,
} from "@mantine/core";
import { IconCameraSelfie, IconPhoto, IconPrinter } from "@tabler/icons-react";
import { ResultCard } from "~/components/result-card";
import { DashboardLayout } from "~/layouts/dashboard";

const data = [
  {
    id: 1,
    file: "/Users/dasith/Developer/projects/auditor/tmp-project/test.php",
    filetype: "php",
    search: "\\ssha1_file\\s*\\(",
    match_str: " sha1_file(",
    hits: '$file = sha1_file("/etc/passwd");',
    line: 10,
    severity: "high",
    code: [
      [1, "<?php", false],
      [2, "  ", false],
      [3, "$str = 'test';", false],
      [4, "  ", false],
      [5, "echo base64_encode($str);", false],
      [6, "", false],
      [7, '$out = sbzdecompress("test")', false],
      [8, "", false],
      [9, "", false],
      [10, '$file = sha1_file("/etc/passwd");', true],
      [11, "", false],
      [12, "echo $file;", false],
      [13, "", false],
      [14, "?>", false],
    ],
  },
  {
    id: 2,
    file: "/Users/dasith/Developer/projects/auditor/tmp-project/test.php",
    filetype: "php",
    search: "\\sbase64_encode\\s*\\(",
    match_str: " base64_encode(",
    hits: "echo base64_encode($str);",
    line: 5,
    severity: "not-marked",
    code: [
      [1, "<?php", false],
      [2, "  ", false],
      [3, "$str = 'test';", false],
      [4, "  ", false],
      [5, "echo base64_encode($str);", true],
      [6, "", false],
      [7, '$out = sbzdecompress("test")', false],
      [8, "", false],
      [9, "", false],
      [10, '$file = sha1_file("/etc/passwd");', false],
      [11, "", false],
      [12, "echo $file;", false],
      [13, "", false],
      [14, "?>", false],
    ],
  },
];

const AnalysisReport = () => {
  return (
    <>
      <Container size="xl">
        <Paper
          shadow="md"
          withBorder
          sx={{ backgroundColor: "black" }}
          p={25}
          mt={10}
        >
          <Group position="apart">
            <Stack>
              <Title style={{ color: "white" }}>Report Name</Title>
              <Text>project descriptionw ill be here</Text>
            </Stack>
            <Text> {new Date().toDateString()}</Text>
          </Group>
        </Paper>

        <Grid grow mt={30}>
          <Grid.Col md={6} lg={3}>
            <Accordion
              variant="contained"
              style={{
                backgroundColor: "black",
                position: "sticky",
                top: 100,
                zIndex: 200,
              }}
            >
              <Accordion.Item value="photos">
                <Accordion.Control
                  icon={<IconPhoto size={rem(20)} color={"red"} />}
                >
                  Filetypes
                </Accordion.Control>
                <Accordion.Panel>Content</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="print">
                <Accordion.Control
                  icon={<IconPrinter size={rem(20)} color={"blue"} />}
                >
                  Severity
                </Accordion.Control>
                <Accordion.Panel>Content</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="camera">
                <Accordion.Control
                  icon={<IconCameraSelfie size={rem(20)} color={"teal"} />}
                >
                  Matchers
                </Accordion.Control>
                <Accordion.Panel>
                  <Button onClick={() => alert(0)}> hi</Button>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Grid.Col>
          <Grid.Col md={6} lg={9}>
            {data.map((item) => (
              <ResultCard {...item} key={item.id} />
            ))}
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};

AnalysisReport.PageLayout = DashboardLayout;
export default AnalysisReport;
