import clientPromise from "../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Projects");
    const collection = db.collection("Project_Data");

    const companies = await collection
      .aggregate([
        {
          $match: {
            "Sr.Company Name": { $ne: null }
          }
        },
        {
          $group: {
            _id: "$Sr.Company Name"
          }
        },
        {
          $project: {
            _id: 0,
            company_name: "$_id"
          }
        },
        {
          $sort: { company_name: 1 }
        }
      ])
      .toArray();

    return new Response(JSON.stringify(companies), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching project companies:", error);
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
    const db = client.db("Projects");
    const collection = db.collection("Project_Data");

    const exists = await collection.findOne({ "Sr.Company Name": company_name });
    if (exists) {
      return new Response(
        JSON.stringify({ message: "Company already exists in projects" }),
        { status: 409 }
      );
    }

    await collection.insertOne({
      Sr: {
        "Company Name": company_name
      },
      createdAt: new Date()
    });

    return new Response(
      JSON.stringify({ message: "Company added successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting project company:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}