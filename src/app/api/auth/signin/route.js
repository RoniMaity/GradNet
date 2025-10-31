import { signJWT } from "../../../../libs/jwt";
import prisma from "../../../../libs/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json(
            { error: "Email and password are required." },
            { status: 400 }
        );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return NextResponse.json(
            { error: "Invalid email or password." },
            { status: 401 }
        );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json(
            { error: "Invalid email or password." },
            { status: 401 }
        );
    }


    const token = signJWT({ userId: user.id, email: user.email });

    const res = NextResponse.json(
        { message: "Sign-in successful.", user: { id: user.id, email: user.email } },
        { status: 200 }
    );

    res.cookies.set("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
    });

    return res;
}
