import { GoogleGenerativeAI } from "@google/genai";

// 使用更稳定的模型名称
const MODEL_NAME = 'gemini-1.5-flash';

export const editImageWithGemini = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  
  // 💡 修正 1：改为正确的 Vite 环境变量读取方式
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API Key 缺失，请在 Vercel 环境变量中设置 VITE_GEMINI_API_KEY");
  }

  // 💡 修正 2：改回官方标准的初始化方式
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // 清理 Base64 字符串
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // 💡 修正 3：按照 Gemini 1.5 的标准格式发送请求
    const result = await model.generateContent([
      {
        inlineData: {
          data: cleanBase64,
          mimeType: "image/jpeg"
        }
      },
      { text: prompt + "。请直接返回修改后的图像数据，不要返回文字说明。" }
    ]);

    const response = await result.response;
    const parts = response.candidates?.[0]?.content?.parts;

    if (!parts) {
      throw new Error("AI 没有返回任何内容");
    }

    // 寻找返回结果中的图片数据
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("AI 返回了文字但没有生成图片，请重试");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
