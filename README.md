# AI Image Studio

A modern web application that leverages the Google Gemini API to seamlessly blend a person from one image into a target scene from another, creating a new, photorealistic masterpiece.

Hint: Replace the URL above with a real screenshot of your app for a great first impression!

## Core Features

- **AI-Powered Image Blending:** Intelligently places a person into a new scene with matching light, shadows, and atmosphere.
- **Two-Step Generation Process:** Utilizes a sophisticated workflow involving scene analysis followed by multimodal image composition for high-quality results.
- **Intuitive UI/UX:** A clean, light, and modern interface inspired by Shadcn UI principles, guiding the user through a simple step-by-step process.
- **Download & Share:** Easily download the generated high-resolution image or share the application on social media platforms like LinkedIn and Facebook.
- **Robust & Resilient:** Includes built-in retry logic to handle potential API errors gracefully, ensuring a smoother user experience.
- **Responsive Design:** Fully functional and aesthetically pleasing on both desktop and mobile devices.

## How It Works

The magic behind the image generation is a clever two-step process that uses different capabilities of the Google Gemini API.

1. **Scene Analysis:**
   When the user uploads a "Scene Image" and clicks generate, the application first sends only this image to the `gemini-2.5-flash` model. It uses a specific prompt asking the AI to act as a photographer and generate a detailed, technical prompt describing the scene's environment, lighting conditions, atmosphere, and camera details, while intentionally ignoring any people in the original scene.

2. **Image Composition:**
   The application then takes the "Person Image" provided by the user and the detailed prompt generated in Step 1. It sends both of these assets to the multimodal `gemini-2.5-flash-image-preview` model. The prompt instructs the AI to place the person from the image seamlessly into the scene described by the text prompt, ensuring the final output is coherent and photorealistic.

This method produces significantly better results than simply telling the AI to "merge two images," as it allows the AI to first understand the technical and artistic details of the scene before composing the final shot.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Build Tool:** Vite
- **AI Engine:** Google Gemini API
  - `gemini-2.5-flash` for text-based scene analysis.
  - `gemini-2.5-flash-image-preview` for multimodal image generation.

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key.

### Running the Application

This project uses Vite for a fast local dev experience.

1. Clone the repository (if applicable):
   ```bash
   git clone <your-repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Environment Variables:
   The application requires your Google Gemini API key available as `VITE_API_KEY` (exposed to the client for development simplicity).

   Create a `.env.local` file in the project root and add your key:
   ```
   VITE_API_KEY=your_gemini_api_key_here
   ```

4. Run the project:
   ```bash
   npm run dev
   ```
   Open the local URL Vite prints in the terminal (typically http://localhost:5173).

## Code Structure

- `index.html`: The main entry point of the application.
- `index.tsx`: The root of the React application.
- `App.tsx`: The main application component, setting up the layout and theme.
- `components`: Contains all reusable React components.
  - `ImageReplacer.tsx`: The core component handling the entire UI and user flow.
  - `FileUpload.tsx`: A reusable component for uploading and previewing images.
  - `Header.tsx`, `Button.tsx`, `LoadingOverlay.tsx`: General UI components.
- `services`:
  - `geminiService.ts`: Encapsulates all logic for communicating with the Google Gemini API.
