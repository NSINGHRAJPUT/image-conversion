import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const POST = async (req: NextRequest) => {
  try {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const toFormat = formData.get("to") as string;

    if (!file || !toFormat) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // Read the image file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert image using sharp based on the selected formats
    const convertedImageBuffer = await sharp(buffer)
      .toFormat(toFormat as keyof sharp.FormatEnum)
      .toBuffer();

    // Set the appropriate headers for the response
    return new NextResponse(convertedImageBuffer, {
      headers: {
        "Content-Type": `image/${toFormat}`,
      },
    });
  } catch (error) {
    console.error("Error during image conversion:", error);
    return NextResponse.json(
      { message: "Error converting image" },
      { status: 500 }
    );
  }
};
