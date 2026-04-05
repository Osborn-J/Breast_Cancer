const API_URL = "http://localhost:8000"; // Update this after deployment

export const getPrediction = async (features: number[]) => {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  });
  if (!response.ok) throw new Error("Prediction failed");
  return response.json();
};