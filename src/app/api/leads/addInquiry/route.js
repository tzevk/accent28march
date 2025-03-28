import clientPromise from '../../lib/mongodb';

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("Leads");
    const collection = db.collection("Lead_Data");

    const body = await req.json();
    const {
      company_name,
      type,
      city,
      enquiry_date,
      enquiry_type,
      project_status,
      followup1_description,
    } = body;

    if (!company_name || !city || !enquiry_date) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const newInquiry = {
      company_name,
      type,
      city,
      enquiry_date,
      enquiry_type,
      project_status,
      followup1_description,
      createdAt: new Date(),
    };

    await collection.insertOne(newInquiry);

    return new Response(
      JSON.stringify({ message: "Inquiry added successfully", data: newInquiry }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Error inserting inquiry:", error);
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      { status: 500 }
    );
  }
}