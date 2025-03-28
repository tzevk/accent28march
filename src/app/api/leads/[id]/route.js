import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export async function GET(req, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID format' }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('Leads');
    const collection = db.collection('Lead_Data');

    const lead = await collection.findOne({ _id: new ObjectId(id) });

    if (!lead) {
      return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(lead), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID format' }), { status: 400 });
  }

  const updatedData = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db('Leads');
    const collection = db.collection('Lead_Data');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ message: 'Lead not found or unchanged' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Lead updated successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID format' }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('Leads');
    const collection = db.collection('Lead_Data');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ message: 'Lead not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Lead deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}