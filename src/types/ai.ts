export interface OpenSourceAiModel {
  id: string;
  name: string;
  provider: 'Meta' | 'DeepSeek' | 'Mistral' | 'Qwen' | 'Local / Ollama' | 'Custom';
  description: string;
  contextWindow: string;
  isLocalAvailable?: boolean;
}

export const OPEN_SOURCE_MODELS: OpenSourceAiModel[] = [
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 (Reasoning)',
    provider: 'DeepSeek',
    description: 'High-power open-source reasoning model with advanced chain-of-thought logic.',
    contextWindow: '64k'
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    description: 'State-of-the-art open-source 671B MoE architecture with unmatched coding and general fluency.',
    contextWindow: '128k'
  },
  {
    id: 'llama-3.3-70b',
    name: 'Llama 3.3 70B Instruct',
    provider: 'Meta',
    description: 'Flagship open-source language model by Meta, fine-tuned for versatile tasks.',
    contextWindow: '128k'
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large 2',
    provider: 'Mistral',
    description: 'Premier European open-weight multilingual model with exceptional reasoning precision.',
    contextWindow: '128k'
  },
  {
    id: 'qwen-2.5-72b',
    name: 'Qwen 2.5 72B',
    provider: 'Qwen',
    description: 'Alibaba Cloud open-source powerhouse for math, coding, and multi-turn workflows.',
    contextWindow: '128k'
  },
  {
    id: 'ollama-local',
    name: 'Local Ollama Instance',
    provider: 'Local / Ollama',
    description: 'Runs offline on your local machine via localhost:11434 with zero data leaving your device.',
    contextWindow: 'Local RAM',
    isLocalAvailable: true
  }
];

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
  modelUsed?: string;
  reasoning?: string;
}

export interface AiAssistantConfig {
  selectedModelId: string;
  customEndpointUrl?: string;
  apiKey?: string;
  temperature: number;
  systemPrompt: string;
  webSearchGrounding: boolean;
}
