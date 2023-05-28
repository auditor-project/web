/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type UseListStateHandlers } from "@mantine/hooks";
import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai";

interface IStartAuditorAgent {
  key: string;
  code: string;
  match: string;
  search: string;
  hits: string;
  history: ChatCompletionRequestMessage[];
  handlers: UseListStateHandlers<ChatCompletionRequestMessage>;
  setIsLoading: (value: boolean) => void;
}

export class AuditorAgent {
  openai: OpenAIApi;
  code: string;
  match: string;
  search: string;
  hits: string;
  history: ChatCompletionRequestMessage[];
  handlers: UseListStateHandlers<ChatCompletionRequestMessage>;
  setIsLoading: (value: boolean) => void;

  constructor(data: IStartAuditorAgent) {
    const configuration = new Configuration({
      apiKey: data.key,
    });

    this.code = data.code;
    this.match = data.match;
    this.search = data.search;
    this.hits = data.hits;
    this.history = data.history;
    this.handlers = data.handlers;
    this.openai = new OpenAIApi(configuration);
    this.setIsLoading = data.setIsLoading;
  }

  async start() {
    this.setIsLoading(true);
    const result = await this._gptAsk();
    this.setIsLoading(false);
    return result;
  }

  async addUserQuestion(question: string) {
    this.setIsLoading(true);
    this.handlers.append({
      role: "user",
      content: question,
    });

    const result = await this._gptAsk();
    this.setIsLoading(false);
    return result;
  }

  generateStartPrompt() {
    return `
    below inside the <START_CODE>  </START_CODE> tags it displays the full code file which auditor detected a security vulnerability. 
    <START_CODE>
    ${this.code}
    </START_CODE>

    the specifc line auditor detected the vulnerability is inside the <SPECIFIC_CODE> tag and ends with </SPECIFIC_CODE> tag.

    <SPECIFIC_CODE>
    ${this.hits}
    </SPECIFIC_CODE>

    this was the specific hit auditor identified as a potentioal security vulnerability. auditor found this while looking for matches like this note that match is inside the <MATCH> tag and ends with 
    </MATCH>

    <MATCH> ${this.match} </MATCH>
    `;
  }

  async _gptAsk() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: this.history,
    });

    this.setIsLoading(true);

    if (response?.data?.choices[0]?.message) {
      const result = await response.data.choices[0].message.content;
      this.handlers.append({
        role: "assistant",
        content: result,
      });
    } else {
      console.log(response.data);
    }

    this.setIsLoading(false);
  }

  getHistory(): Array<ChatCompletionRequestMessage> {
    return this.history;
  }

  generateSystemPrompt(): string {
    return `
    You are a code auditor, your job is to look in to a code and identify any potential vulnerabilities and if possible give a sudgesion for a fix, also you are suppose to explain
    the code a little bit also if possible, this is a additional thing if you can do that its pretty awsome.  your name is auditor you are the assistant of auditor. auditor is a static code analyzer tool
    what you mostly do is basically when auditor the code analyzer detects an security vulnerability you are here to provide additional information. when outputing the code I want you to output the code in 
    the below format.  basically <ASSISTANT_RESULT> start with this tag and end with </ASSISTANT_RESULT> tag.  <ASSISTANT_RESULT> is the result of the assistant.  </ASSISTANT_RESULT> is the result of the assistant.`;
  }
}
