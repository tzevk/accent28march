import clientPromise from '../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body  = await req.json();

    /* ---------- shape payload ---------- */
    const Sr = {
      "Company Name"         : body.companyName,
      "City"                 : body.city,
      "Project Mode"         : body.mode,
      "Project No"           : body.projectNumber,
      "Start Date"           : body.startDate,
      "End Date"             : body.endDate,
      "Target Date"          : body.targetDate,
      "Project Description"  : body.projectName,
      "Date of Completion"   : body.completion     ?? null,
      "Project Status"       : body.status,
      "Progress"             : body.progress       ?? '',
      "Assigned To"          : body.assignedTo     ?? '',
      "Inhouse/ Outsource /Client's Office": body.execMode     ?? '',
      "Outsorced Company"    : body.outsourcedCo   ?? '',
      "Billing status"       : body.billing        ?? null,
      "Year"                 : `${new Date().getFullYear()}-${(
                                 new Date().getFullYear() + 1
                               ).toString().slice(-2)}`
    };

    /* ---------- generate projectId ---------- */
    const client = await clientPromise;
    const db     = client.db('Projects');
    const col    = db.collection('Project_Data');

    const counter = await col.countDocuments();
    const year    = new Date().getFullYear();
    const projectId = `PRJ-${year}-${String(counter + 1).padStart(3, '0')}`;

    /* ---------- insert ---------- */
    await col.insertOne({
      projectId,
      Sr,
      createdAt: new Date()
    });

    return NextResponse.json(
      { message: 'Project saved', projectId },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/projects/add', err);
    return NextResponse.json(
      { error: 'Failed to save project' },
      { status: 500 }
    );
  }
}