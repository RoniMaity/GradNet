import { signJWT } from "../../../../libs/jwt";
import prisma from "../../../../libs/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password, collegeName, graduationYear, branch } = await req.json();
    console.log(name, email, password, collegeName, graduationYear)
    if (!name || !email || !password || !collegeName || !graduationYear || !branch) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const collegeNameRecord = await prisma.college.upsert({
      where: { name: collegeName },
      create: { name: collegeName },
      update: {}
    });


    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        graduationYear: Number(graduationYear),
        college: { connect: { id: collegeNameRecord.id } },
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
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Something went wrong while creating the user." },
      { status: 500 }
    );
  }
}
