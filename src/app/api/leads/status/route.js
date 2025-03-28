import clientPromise from '../../lib/mongodb';

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("Leads");
    const collection = db.collection("Lead_Data");

    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const query = year ? { year: parseInt(year, 10) } : {};

    const result = await collection.aggregate([
      { $match: { ...query, enquiry_status: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: { $toLower: "$enquiry_status" },
          count: { $sum: 1 },
        },
      },
    ]).toArray();

    const statusMap = {
      open: "Open",
      "under discussion": "Under Discussion",
      awaiting: "Awaiting",
      awarded: "Awarded",
      closed: "Closed",
      close: "Closed",
    };

    const counts = { Open: 0, "Under Discussion": 0, Awaiting: 0, Awarded: 0, Closed: 0 };

    result.forEach((item) => {
      if (item._id && statusMap[item._id.trim()]) {
        counts[statusMap[item._id.trim()]] += item.count;
      }
    });

    return Response.json(counts);
  } catch (error) {
    console.error("❌ Error in API:", error);
    return Response.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}