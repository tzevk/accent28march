import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('CRM');
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'User deleted' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to delete user' }), { status: 500 });
  }
}