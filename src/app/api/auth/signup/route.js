import { signJWT } from "../../../../libs/jwt";
import prisma from "../../../../libs/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password, collegeName, graduationYear, branch } = await req.json();
    
    if (!name || !email || !password || !collegeName || !graduationYear || !branch) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Email taken" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);

    const college = await prisma.college.upsert({
      where: { name: collegeName },
      create: { name: collegeName },
      update: {}
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hash,
        graduationYear: Number(graduationYear),
        branch,
        collegeId: college.id,
      },
    });

    const token = signJWT({ userId: user.id, email: user.email });

    const res = NextResponse.json(
      { message: "Account created", token },
      { status: 201 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 2592000,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
