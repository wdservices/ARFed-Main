export interface ChatMessageData {
  id: string;
  text: string;
  sender: "user" | "ai" | "system";
  timestamp: Date;
  isLoading?: boolean;
}
