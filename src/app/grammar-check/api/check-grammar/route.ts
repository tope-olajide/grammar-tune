import escapeText from "@/app/utils/escapeText";
import { NextResponse } from "next/server";


    const endpoint = process.env.API_ENDPOINT;
const key = process.env.API_KEY;
    
export async function POST(request: Request) {
    // Parse the request body
    const { text, language, aiModel } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }
  if (!language) {
    return NextResponse.json({ error: "Language is required" }, { status: 400 });
  }
  if (!aiModel) {
    return NextResponse.json({ error: "AI Model is required" }, { status: 400 });
  }

  // Ensure environment variables are defined
    if (!endpoint || !key) {
      return NextResponse.json(
        { error: "API_ENDPOINT or API_KEY is not defined in environment variables" },
        { status: 500 }
      );
    }
  try {

    const escapedText = escapeText(text)
 
    const query = `
      query {
        checkGrammarErrors(text: "${escapedText}", language:"${language}", aiModel:"${aiModel}")
      }
    `;

    // Make the API call
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
console.log({data})
    if (data.errors) {
      throw new Error(data.errors[0]?.message || "GraphQL error occurred");
    }

    if (!data.data?.checkGrammarErrors) {
      throw new Error("Invalid response format");
    }

    return NextResponse.json({ result: data.data.checkGrammarErrors });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
