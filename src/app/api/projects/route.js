import clientPromise from '../lib/mongodb';

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db('Projects');
    const collection = db.collection('Project_Data');

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const filterField = searchParams.get('filterField');

    let query = {};
    if (search && filterField) {
      query[`Sr.${filterField}`] = { $regex: search, $options: 'i' };
    }

    const projects = await collection.find(query, {
      projection: {
        _id: 1,
        'Sr.Year': 1,
        'Sr.Company Name': 1,
        'Sr.City': 1,
        'Sr.Project Mode': 1,
        'Sr.Project No': 1,
        'Sr.Start Date': 1,
        'Sr.End Date': 1,
        'Sr.Project Description': 1,
        'Sr.Date of Completion': 1,
        'Sr.Project Status': 1,
        'Sr.Inhouse/ Outsource /Client\'s Office': 1,
        'Sr.Outsorced Company': 1,
        'Sr.Billing status': 1,
        createdAt: 1,
      },
    }).sort({ createdAt: -1 }).toArray();

    return Response.json(projects);
  } catch (error) {
    console.error('🚨 GET Error (Projects):', error);
    return new Response(JSON.stringify({ error: 'DB error', details: error.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db('Projects');
    const collection = db.collection('Project_Data');

    const srData = await req.json();

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