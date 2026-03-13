export interface MiniApp {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  longDescription: string;
  screenshots: string[];
  rating: number;
  reviews: number;
  developer: string;
  prompts: ConversationStarter[];
  color: string;
}

export interface ConversationStarter {
  id: string;
  text: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  widgets?: Widget[];
  isStreaming?: boolean;
}

export interface Widget {
  id: string;
  type: "map" | "playlist" | "restaurant" | "booking" | "weather" | "shopping" | "itinerary" | "recipe";
  title: string;
  data: Record<string, unknown>;
}

export interface ScriptedConversation {
  promptId: string;
  messages: ChatMessage[];
  streamChunks: string[];
}
