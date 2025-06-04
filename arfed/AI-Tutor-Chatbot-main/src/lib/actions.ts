"use server";

import { summarizeText, type SummarizeTextInput } from "@/ai/flows/summarize-text";
import { z } from "zod";

const SendMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

export interface ChatResponse {
  success: boolean;
  aiResponse?: string;
  error?: string;
}

export async function sendMessageToAI(
  prevState: ChatResponse | null,
  formData: FormData
): Promise<ChatResponse> {
  const validatedFields = SendMessageSchema.safeParse({
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors.message?.join(", "),
    };
  }

  const userInput: SummarizeTextInput = {
    text: validatedFields.data.message,
  };

  try {
    // Using summarizeText as a placeholder for general AI chat interaction.
    // In a real tutor app, this would be a more conversational AI flow.
    const result = await summarizeText(userInput);
    return { success: true, aiResponse: result.summary };
  } catch (error) {
    console.error("Error calling AI flow:", error);
    return { success: false, error: "Failed to get response from AI. Please try again." };
  }
}
