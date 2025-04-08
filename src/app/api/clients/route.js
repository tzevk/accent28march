import clientPromise from "../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("Leads");

    const body = await req.json();
    const result = await db.collection("Lead_Data").insertOne(body);

    return NextResponse.json({ message: "Client added", id: result.insertedId }, { status: 201 });
  } catch (err) {
    console.error("❌ Error in POST /api/clients:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}