import { signJWT } from "../../../../libs/jwt";
import prisma from "../../../../libs/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json(
            { error: "Missing credentials" },
            { status: 400 }
        );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
        );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
        );
    }

    const token = signJWT({ userId: user.id, email: user.email });

    const res = NextResponse.json(
        { message: "Success", user: { id: user.id, email: user.email } },
        { status: 200 }
    );

    res.cookies.set("token", token, {
        httpOnly: true,
        maxAge: 2592000,
        path: "/",
    });

    return res;
}
