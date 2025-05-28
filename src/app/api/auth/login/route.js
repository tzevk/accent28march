// src/app/api/auth/login/route.js
import clientPromise from '../../lib/mongodb';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const ONE_DAY    = 60 * 60 * 24;          // seconds

export async function POST(request) {
  const { email, password, role: requestedRole } = await request.json();

  try {
    const client   = await clientPromise;
    const user     = await client
                       .db('Users')                // <- your DB name
                       .collection('Accounts')     // <- your collection
                       .findOne({ email });

    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    /* ---- plain-text password check ------------------------------------ */
    if (password !== user.password)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    /* ---- role check ---------------------------------------------------- */
    if (user.role !== requestedRole)
      return NextResponse.json({ error: 'Role mismatch' }, { status: 403 });

    /* ---- sign JWT & send as http-only cookie --------------------------- */
    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const res = NextResponse.json({ role: user.role, token });
    res.cookies.set('accessToken', token, {
      httpOnly: true,
      path    : '/',
      maxAge  : ONE_DAY,
    });
    return res;

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}