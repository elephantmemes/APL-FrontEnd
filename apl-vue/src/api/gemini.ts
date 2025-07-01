export async function getGeminiExplanation(code: string) {
  const response = await fetch("http://127.0.0.1:5000/api/explain", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ code })
  });

  const data = await response.json();
  return data.explanation || "No explanation returned.";
}
