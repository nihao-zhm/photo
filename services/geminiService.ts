import axios from 'axios';

const ALIYUN_API_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";

export const editImageWithGemini = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  const API_KEY = process.env.ALIYUN_API_KEY;

  if (!API_KEY) {
    throw new Error("请在 .env.local 中配置 ALIYUN_API_KEY");
  }

  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  try {
    const response = await axios.post(
      ALIYUN_API_URL,
      {
        model: "qwen-vl-max",
        input: {
          messages: [
            {
              role: "user",
              content: [
                { image: `data:image/jpeg;base64,${cleanBase64}` },
                { text: prompt }
              ]
            }
          ]
        },
        parameters: {
          result_format: "message"
        }
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const outputContent = response.data.output.choices[0].message.content;
    const resultImage = outputContent.find((item: any) => item.image)?.image;

    if (!resultImage) {
      throw new Error("阿里云 AI 未能返回处理后的图片");
    }

    return resultImage;
  } catch (error) {
    console.error("阿里云 API 调用失败:", error);
    throw error;
  }
};
