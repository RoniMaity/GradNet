import { signJWT } from "../../../../libs/jwt";
import prisma  from "../../../../libs/prisma";
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required." },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "User with this email already exists." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
    },
  });

  const token = signJWT({ userId: newUser.id, email: newUser.email });

  const res = NextResponse.json(
    { message: "User created successfully.", token },
    { status: 201 }
  );

  res.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, 
    path: "/",
  });

  return res;
}