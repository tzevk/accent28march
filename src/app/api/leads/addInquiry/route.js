import clientPromise from '../../lib/mongodb';

export async function POST(req) {
  try {
    /* ---------- parse & validate body ---------- */
    const body = await req.json();
    const {
      company_name, type, city,
      enquiry_date, enquiry_type,
      project_status, followup1_description = '-',
    } = body;

    if (
      !company_name || !type || !city ||
      !enquiry_date || !enquiry_type || !project_status
    ) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 },
      );
    }

    /* ---------- db connection ---------- */
    const client      = await clientPromise;
    const collection  = client.db('Leads').collection('Lead_Data');

    /* ---------- compute next serial number ---------- */
    const last = await collection
      .find({}, { projection: { sr_no: 1 } })
      .sort({ sr_no: -1 })          // highest first
      .limit(1)
      .toArray();

    const nextSr = last.length ? (last[0].sr_no ?? 0) + 1 : 1;

    /* ---------- insert  ---------- */
    await collection.insertOne({
      sr_no    : nextSr,
      company_name, type, city,
      enquiry_date, enquiry_type,
      project_status,
      followup1_description,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ message: 'Inquiry added', sr_no: nextSr }),
      { status: 201 },
    );

  } catch (err) {
    console.error('🚨 Insert lead error:', err);
    return new Response(
      JSON.stringify({ message: 'Server Error', error: err.message }),
      { status: 500 },
    );
  }
}