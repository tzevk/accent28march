import clientPromise from '../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db     = client.db('Projects');
    const col    = db.collection('Project_Data');   // ← your collection

    const projects = await col
      .find({}, { projection: { createdAt: 0 } })
      .sort({ createdAt: 1 })              //  oldest → newest
      .toArray();

    return Response.json(projects);
  } catch (err) {
    console.error('GET /api/projects', err);
    return new Response(
      JSON.stringify({ error: 'DB error', details: err.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db('Projects');
    const collection = db.collection('Project_Data');

    const data = await req.json();

    // Normalize incoming camelCase or inconsistent keys to expected format
    const srData = {
      "Company Name": data["Company Name"] || data.companyName || "",
      "Project Description": data["Project Description"] || data.projectDescription || "",
      "Start Date": data["Start Date"] || data.startDate || "",
      "End Date": data["End Date"] || data.endDate || "",
      "Date of Completion": data["Date of Completion"] || data.dateOfCompletion || "",
      "Project Mode": data["Project Mode"] || data.projectMode || "",
      "Assigned To": data["Assigned To"] || data.assignedTo || "",
      "Salary": data["Salary"] || data.salary || "",
      "Manhours": data["Manhours"] || data.manhours || "",
      "Manpower": data["Manpower"] || data.manpower || "",
      "Project No": data["Project No"] || data.projectNumber || "",
      "Project Status": data["Project Status"] || data.status || "",
      "City": data["City"] || data.city || "",
      "Year": data["Year"] || data.year || "",
      "Inhouse/ Outsource /Client's Office":
        data["Inhouse/ Outsource /Client's Office"] || data.executionMode || "",
      "Outsorced Company": data["Outsorced Company"] || data.outsourcedCompany || "",
      "Billing status": data["Billing status"] || data.billingStatus || ""
    };

    // Validation for critical fields
    const requiredFields = ['Company Name', 'Start Date', 'Project Description'];
    for (const field of requiredFields) {
      if (!srData[field]) {
        return new Response(JSON.stringify({ message: `Missing required field: ${field}` }), {
          status: 400,
        });
      }
    }

    await collection.insertOne({
      Sr: srData,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: 'Project added successfully' }), {
      status: 201,
    });
  } catch (error) {
    console.error('🚨 POST Error (Projects):', error);
    return new Response(JSON.stringify({ error: 'DB error', details: error.message }), {
      status: 500,
    });
  }
}