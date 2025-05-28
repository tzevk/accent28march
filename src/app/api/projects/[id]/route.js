import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';
const isObjId = (v) => ObjectId.isValid(v) && String(new ObjectId(v)) === v;


export async function GET(req, { params }) {
  const { id } = params;                 // id can be ObjectId or projectId

  try {
    const client = await clientPromise;
    const db      = client.db('Projects');
    const col     = db.collection('Project_Data');

    const project = await col.findOne(
      isObjId(id) ? { _id: new ObjectId(id) } : { projectId: id }
    );

    if (!project)
      return new Response(JSON.stringify({ message: 'Project not found' }), { status: 404 });

    return new Response(JSON.stringify(project), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('GET /projects/[id] error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

/* -------------------------------------------------
   PUT  /api/projects/[id]
   body = updated Sr object
-------------------------------------------------- */
export async function PUT(req, { params }) {
  const { id } = params;
  const sr = await req.json();           // expect updated Sr data

  try {
    const client = await clientPromise;
    const db      = client.db('Projects');
    const col     = db.collection('Project_Data');

    const result = await col.updateOne(
      isObjId(id) ? { _id: new ObjectId(id) } : { projectId: id },
      { $set: { Sr: sr } }
    );

    if (!result.matchedCount)
      return new Response(JSON.stringify({ message: 'Project not found' }), { status: 404 });

    return new Response(JSON.stringify({ message: 'Project updated' }), { status: 200 });
  } catch (err) {
    console.error('PUT /projects/[id] error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

/* -------------------------------------------------
   DELETE /api/projects/[id]
-------------------------------------------------- */
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db      = client.db('Projects');
    const col     = db.collection('Project_Data');

    const result = await col.deleteOne(
      isObjId(id) ? { _id: new ObjectId(id) } : { projectId: id }
    );

    if (!result.deletedCount)
      return new Response(JSON.stringify({ message: 'Project not found' }), { status: 404 });

    return new Response(JSON.stringify({ message: 'Project deleted' }), { status: 200 });
  } catch (err) {
    console.error('DELETE /projects/[id] error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}