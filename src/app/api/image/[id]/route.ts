import { fetchImage } from "@/lib/services/placid";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isNaN(parseInt(id, 10))) {
      return NextResponse.json({ error: "Invalid image ID" }, { status: 400 });
    }

    const imageData = await fetchImage(parseInt(id, 10));

    if (!imageData) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(imageData);
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
