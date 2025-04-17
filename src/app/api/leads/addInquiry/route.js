import clientPromise from '../../lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      company_name,
      type,
      city,
      enquiry_date,
      enquiry_type,
      project_status,
      followup1_description
    } = body;

    if (!company_name || !type || !city || !enquiry_date || !enquiry_type || !project_status) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Leads");
    const collection = db.collection("Lead_Data");

    const newEntry = {
      company_name,
      type,
      city,
      enquiry_date,
      enquiry_type,
      project_status,
      followup1_description: followup1_description || "-"
    };

    await collection.insertOne(newEntry);

    return new Response(JSON.stringify({ message: "Inquiry added successfully" }), { status: 201 });
  } catch (error) {
    console.error("Error inserting inquiry:", error);
    return new Response(JSON.stringify({ message: "Server Error", error: error.message }), { status: 500 });
  }
}