import escapeText from "@/app/utils/escapeText";
import { NextResponse } from "next/server";


const endpoint = process.env.API_ENDPOINT;
const key = process.env.API_KEY;
    
export async function POST(request: Request) {
    // Parse the request body
    const { text, mode, aiModel } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }
  if (!mode) {
    return NextResponse.json({ error: "Mode is required" }, { status: 400 });
    }
    if (!aiModel) {
    return NextResponse.json({ error: "aiModel is required" }, { status: 400 });
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
        paraphraseText(text: "${escapedText}", mode:"${mode}", aiModel: "${aiModel}")
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

    if (data.errors) {
      throw new Error(data.errors[0]?.message || "GraphQL error occurred");
    }

    if (!data.data?.paraphraseText) {
      throw new Error("Invalid response format");
    }

    return NextResponse.json({ result: data.data.paraphraseText });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
