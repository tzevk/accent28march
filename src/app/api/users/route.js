import clientPromise from '../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('CRM');
    const users = await db.collection('users').find({}).toArray();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 });
  }
}