import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ message: "Niste ulogovani" }, { status: 401 });
    }

    verifyAuthToken(token);

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Fajl nije poslat." }, { status: 400 });
    }

    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { message: "Podrzani formati su: JPG, PNG, WEBP, GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ message: "Maksimalna velicina je 5MB." }, { status: 400 });
    }

    const extension = ALLOWED_TYPES[file.type];
    const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);

    await mkdir(uploadDir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, bytes);

    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Greska pri upload-u slike." }, { status: 500 });
  }
}
