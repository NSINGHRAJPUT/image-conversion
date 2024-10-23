import { NextResponse } from "next/server";
import sharp from "sharp";

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    // Retrieve the file from the form data
    const file = formData.get("image");
    const format = formData.get("format") || "png"; // Output format, default to 'png'

    if (!file || !file.arrayBuffer) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded",
        },
        { status: 400 }
      );
    }

    // Convert the uploaded file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Use Sharp to convert the image to the desired format
    const convertedImageBuffer = await sharp(buffer)
      .toFormat(format) // Convert the image to the requested format
      .toBuffer();

    // Set the appropriate headers for the response
    const headers = new Headers();
    headers.set("Content-Type", `image/${format}`);

    // Return the converted image as the response
    return new Response(convertedImageBuffer, {
      headers,
    });
  } catch (error) {
    console.error("Error processing form submission:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit form",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
};
