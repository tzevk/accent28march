import clientPromise from "../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ message: "No data to import" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Leads");

    const result = await db.collection("Lead_Data").insertMany(data);

    return NextResponse.json({ message: `✅ Imported ${result.insertedCount} clients` }, { status: 201 });
  } catch (error) {
    console.error("❌ Import error:", error);
    return NextResponse.json({ message: "Server error during import" }, { status: 500 });
  }
}