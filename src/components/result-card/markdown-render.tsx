/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/no-children-prop */
import React from "react";
import { Text } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import { Prism } from "@mantine/prism";
import { type Language } from "prism-react-renderer";
import remarkGfm from "remark-gfm";

export const MarkdownRenderer = ({ content }: any) => {
  return (
    <Text>
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <Prism
                my={5}
                {...props}
                children={String(children).replace(/\n$/, "")}
                language={match[1] as Language}
              />
            ) : (
              <Prism className={className} language="tsx" my={4}>
                {children.join("\n")}
              </Prism>
            );
          },
        }}
      />
    </Text>
  );
};
