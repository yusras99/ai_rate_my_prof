import { NextResponse } from "next/server";

// Function to handle POST requests to /api/submit_professor
export async function POST(req) {
  try {
    // Parse the request body
    const data = await req.json();

    // Example: Log the received data
    console.log("Received data:", data);

    // Process the data (e.g., validate, save to database, etc.)
    // For now, we just return a success response
    return NextResponse.json({
      status: "success",
      message: "Professor data submitted successfully",
    });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { error: "Failed to submit professor data" },
      { status: 500 }
    );
  }
}
