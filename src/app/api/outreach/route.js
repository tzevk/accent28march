import clientPromise from '../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
      const client = await clientPromise;
      const db = client.db("Leads");
      const outreachLeads = await db.collection("Lead_Data").find({
        followup1_date: { $ne: "" },
        followup1_description: { $nin: ["", "-", null] }
      }, {
        projection: {
          _id: 0,
          company_name: 1,
          followup1_date: 1,
          followup1_description: 1
        }
      }).toArray();
  
      return NextResponse.json(outreachLeads);
    } catch (err) {
      console.error("🚨 Outreach API error:", err);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }