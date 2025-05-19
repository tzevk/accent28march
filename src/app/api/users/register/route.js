import clientPromise from '../../lib/mongodb';

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db(); // uses default DB from URI

    const body = await req.json();
    const {
      empCode,
      name,
      phone,
      email,
      password,
      department,
      designation,
      attendanceCategory,
      role,
      status,
      isActive
    } = body;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Required fields missing' }), { status: 400 });
    }

    // Optional: check for duplicates by email
    const existing = await db.collection('users').findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ error: 'User with this email already exists' }), { status: 409 });
    }

    const newUser = {
      empCode,
      name,
      phone,
      email,
      password, // optionally hash this
      department,
      designation,
      attendanceCategory,
      role,
      status,
      isActive,
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);

    return new Response(JSON.stringify({ success: true, id: result.insertedId }), { status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}