import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiModel = (modelName: string = "gemini-pro") => {
  return genAI.getGenerativeModel({ model: modelName });
};

export const generateInsight = async (prompt: string): Promise<string> => {
  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to generate insight: ${error.message}`);
  }
};

export const generateStructuredInsight = async (
  prompt: string,
  schema?: any
): Promise<string> => {
  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to generate structured insight: ${error.message}`);
  }
};

export default genAI;
