import {
  CopilotRuntime,
  LangChainAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { ChatOpenAI } from "@langchain/openai";
import { NextRequest } from 'next/server';

const model = new ChatOpenAI({
  model: process.env.SYNAPSE_MODEL ?? "gpt-4o",
  apiKey: process.env.SYNAPSE_API_KEY!,
  configuration: {
    baseURL: process.env.SYNAPSE_BASE_URL ?? "https://llm.synapse.thalescloud.io/v1",
  },
});

const serviceAdapter = new LangChainAdapter({
  chainFn: async ({ messages, tools }) => {
    return model.bindTools(tools).stream(messages);
  },
});

// const serviceAdapter = new OpenAIAdapter();
const runtime = new CopilotRuntime();
 
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  });
 
  return handleRequest(req);
};