import { NextResponse } from "next/server";

type ApiResponse = {
  result?: string;
  error?: string;
};
    const endpoint = process.env.API_ENDPOINT;
    const key = process.env.API_KEY;
export async function POST(request: Request) {
    // Parse the request body
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

  // Ensure environment variables are defined


    if (!endpoint || !key) {
      return NextResponse.json(
        { error: "API_ENDPOINT or API_KEY is not defined in environment variables" },
        { status: 500 }
      );
    }
  try {

    // Escape all special characters that could interfere with GraphQL string syntax
    const escapedText = text.replace(/[\\"'`\n\r\t\b\f]/g, (char: string | number) => {
      const escapes: { [key: string]: string } = {
        '\\': '\\\\',
        '"': '\\"',
        "'": "\\'",
        '`': '\\`',
        '\n': '\\n',
        '\r': '\\r',
        '\t': '\\t',
        '\b': '\\b',
        '\f': '\\f'
      };
      return escapes[char];
    });
    console.log({ escapedText });
    const query = `
      query {
        checkGrammarErrors(text: "${escapedText}")
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

    if (!data.data?.checkGrammarErrors) {
      throw new Error("Invalid response format");
    }

    return NextResponse.json({ result: data.data.checkGrammarErrors });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
