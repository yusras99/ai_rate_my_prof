require("dotenv").config();
import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { HfInference } from "@huggingface/inference";

const systemPrompt = `
You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
For every user question, the top 3 professors that match the user question are returned.
Use them to answer the question if needed.
`;
export async function POST(req) {
  try {
    const data = await req.json();
    // set up connections to Pinecone and OpenAI
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pc.index("rag").namespace("rmp-krishna");

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY, // Use process.env to access environment variables securely
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000/", // Optional, for including your app on openrouter.ai rankings.
        "X-Title": "Rate My professors, AI", // Optional. Shows in rankings on openrouter.ai.
      },
    });

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    // Extract the user’s question (the last msg) and create an embedding
    const user_query = data[data.length - 1].content;
    const user_query_embedding = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: user_query,
    });

    // Use the embedding to find similar professor reviews in Pinecone
    const topMatches = await index.query({
      topK: 10, // how many results we need
      includeMetadata: true,
      vector: user_query_embedding,
    });

    console.log(topMatches);

    const contexts = topMatches.matches.map((item) => item.metadata.text);
    const augmentedQuery = `<CONTEXT>\n${contexts
      .slice(0, 10)
      .join(
        "\n\n-------\n\n"
      )}\n-------\n</CONTEXT>\n\n\n\nMY QUESTION:\n${user_query}`;
    console.log(augmentedQuery);

    // Combine the user’s question with the Pinecone results
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...lastDataWithoutLastMessage,
        { role: "user", content: augmentedQuery },
      ],
      model: "meta-llama/llama-3.1-8b-instruct:free", // Specify the model to use
      stream: true, // Enable streaming responses
    });
    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });
    return new NextResponse(stream);
  } catch (error) {
    console.error("Error in POST /api/chat:", error); // Log the error for debugging
    return NextResponse.json({ error: error.message }, { status: 400 }); // Return a 400 Bad Request response with the error message
  }
}
