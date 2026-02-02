import { NextResponse } from "next/server";

const MODAL_INFERENCE_URL = "https://sayantannandi13--audio-cnn-inference-audioclassifier-inference.modal.run/";



export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: "Use POST" }, { status: 405 });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    const audioData =
      typeof body === "object" && body !== null && "audio_data" in body
        ? (body as Record<string, unknown>).audio_data
        : undefined;

    if (typeof audioData !== "string" || audioData.length === 0) {
      return NextResponse.json({ error: "audio_data is required" }, { status: 400 });
    }

    const upstream = await fetch(MODAL_INFERENCE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audio_data: audioData }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return NextResponse.json(
        { error: "Upstream error", status: upstream.status, detail: text },
        { status: upstream.status },
      );
    }

    const data = (await upstream.json()) as unknown;
    return NextResponse.json(data);
  } catch (error) {
    console.error("/api/inference error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
