import clientPromise from '../lib/mongodb';

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db('Leads');
    const collection = db.collection('Lead_Data');

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const filterField = searchParams.get('filterField');

    let query = {};
    if (search && filterField) {
      query[filterField] = { $regex: search, $options: 'i' };
    }

    const leads = await collection.find(query, {
      projection: {
        sr_no: 1,
        company_name: 1,
        type: 1,
        city: 1,
        enquiry_date: 1,
        enquiry_type: 1,
        project_status: 1,
        followup1_description: 1,
      },
    }).sort({ sr_no: 1 }).toArray();

    return Response.json(leads);
  } catch (error) {
    console.error('🚨 GET Error:', error);
    return new Response(JSON.stringify({ error: 'DB error', details: error.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db('Leads');
    const collection = db.collection('Lead_Data');

    const newLead = await req.json();

    if (!newLead.company_name || !newLead.enquiry_date) {
      return new Response(JSON.stringify({ message: 'Company name and enquiry date are required' }), {
        status: 400,
      });
    }

    await collection.insertOne(newLead);
    return new Response(JSON.stringify({ message: 'Lead added successfully' }), {
      status: 201,
    });
  } catch (error) {
    console.error('🚨 POST Error:', error);
    return new Response(JSON.stringify({ error: 'DB error', details: error.message }), {
      status: 500,
    });
  }
}