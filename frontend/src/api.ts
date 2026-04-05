// Use the Vercel environment variable, or fallback to local for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const getPrediction = async (features: number[]) => {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Prediction failed");
  }

  return response.json();
};