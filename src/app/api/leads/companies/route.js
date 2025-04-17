import clientPromise from "../../lib/mongodb";
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Leads");
    const collection = db.collection("Lead_Data");

    const companies = await collection
      .find({ company_name: { $ne: null } }, { projection: { _id: 0, company_name: 1 } })
      .toArray();

    return new Response(JSON.stringify(companies), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error", error: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { company_name } = body;

    if (!company_name || typeof company_name !== "string") {
      return new Response(JSON.stringify({ message: "Invalid company name" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("Leads");
    const collection = db.collection("Lead_Data");

    const existing = await collection.findOne({ company_name });
    if (existing) {
      return new Response(
        JSON.stringify({ message: "Company already exists" }),
        { status: 409 }
      );
    }

    await collection.insertOne({ company_name });

    return new Response(
      JSON.stringify({ message: "Company added successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting company:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}