import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

// Read API key from Vite client env
const apiKey = import.meta.env.VITE_API_KEY as string | undefined;
if (!apiKey) {
  throw new Error("VITE_API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Converts a File object to a base64 string and extracts its MIME type.
 * @param file The File object to convert.
 * @returns A promise that resolves to an object with base64 data and MIME type.
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(',')[1];
      const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      });
    };
    reader.onerror = (error) => reject(error);
  });
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const retryDelayMs = (attempt: number): number => {
  // attempt is 1-based; attempt 1 has no delay (first try)
  if (attempt <= 1) return 0;
  if (attempt === 2) return 5000; // first retry after 5s
  return 10000; // subsequent retries after 10s
};

/**
 * Analyzes an image file and returns a textual description.
 * @param imageFile The image file to analyze.
 * @returns A promise that resolves to a string describing the image.
 */
export const analyzeImage = async (imageFile: File): Promise<string> => {
  const imagePart = await fileToGenerativePart(imageFile);
  const textPart = { text: "give a short description of the background and scene in the image. focus on environment, lighting conditions, atmosphere, and technical details such as camera and lens. avoid describing people or humans in the image. create a detailed prompt for AI image generation that I can use. start directly with the prompt without explanation. keep the prompt short but technically detailed." };

  const maxAttempts = 10;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (attempt > 1) {
        await delay(retryDelayMs(attempt));
      }
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
      });
      return response.text;
    } catch (error) {
      console.error(`Analyze attempt ${attempt} failed:`, error);
      if (attempt === maxAttempts) {
        throw new Error("Failed to analyze the image after multiple retries.");
      }
    }
  }
  throw new Error("Analyze failed unexpectedly.");
};

/**
 * Generates an image from a text prompt.
 * @param prompt The text prompt to generate an image from.
 * @returns A promise that resolves to a data URL of the generated image.
 */
export const generateImageFromText = async (prompt: string): Promise<string> => {
  const maxAttempts = 10;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (attempt > 1) await delay(retryDelayMs(attempt));
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image && response.generatedImages[0].image.imageBytes) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        const mimeType = 'image/jpeg';
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
      throw new Error("Image generation succeeded but no image data was returned.");
    } catch (error) {
      console.error(`Text-image attempt ${attempt} failed:`, error);
      if (attempt === maxAttempts) {
        throw new Error("Failed to generate the image from the prompt after multiple retries.");
      }
    }
  }
  throw new Error("Image generation from text failed unexpectedly.");
};

/**
 * Generates a new image by placing a person from an image file into a scene described by a prompt.
 * This uses a multimodal model to edit the person's image into the new context.
 * It includes retry logic for robustness.
 * @param scenePrompt The detailed prompt describing the target scene.
 * @param personImageFile The image file of the person to insert.
 * @returns A promise that resolves to a data URL of the final composite image.
 */
export const generateReplacedImage = async (scenePrompt: string, personImageFile: File): Promise<string> => {
  const personImagePart = await fileToGenerativePart(personImageFile);

  const finalPrompt = `Take the person from the provided image and place them seamlessly into the scene described in the following prompt. The final image should be photorealistic, with lighting, shadows, and style that perfectly match the scene.\n\nScene Prompt: ${scenePrompt}`;
  
  const textPart = { text: finalPrompt };

  const maxAttempts = 10;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (attempt > 1) await delay(retryDelayMs(attempt));
      console.log(`Attempt ${attempt} to generate final image with multimodal model...`);
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
          parts: [personImagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT], // Must include both
        },
      });

      // Extract the image from the response parts
      if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const base64ImageBytes: string = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png'; // default mime type
            return `data:${mimeType};base64,${base64ImageBytes}`;
          }
        }
      }

      // If loop completes without returning, no image was found.
      throw new Error("Image generation succeeded but no image data was returned in the response.");

    } catch (error) {
      console.error(`Compose attempt ${attempt} failed:`, error);
      if (attempt === maxAttempts) {
        throw new Error("Failed to generate the final image after multiple retries.");
      }
    }
  }
  
  // This line should not be reachable, but is a fallback.
  throw new Error("Image generation failed unexpectedly after all retries.");
};
