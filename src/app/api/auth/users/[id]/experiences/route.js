import { NextResponse } from "next/server";
import prisma from "../../../../../../libs/prisma";
import { authenticateRequest } from "../../../../../../libs/auth";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const experiences = await prisma.experience.findMany({
            where: { userId: parseInt(id) },
            orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }]
        });

        return NextResponse.json(experiences);
    } catch (err) {
        console.error("fetch experiences error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const user = authenticateRequest(request);
        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const { id } = await params;
        const userId = parseInt(id);

        if (user.id !== userId) {
            return NextResponse.json({ error: "Can only add to your own profile" }, { status: 403 });
        }

        const { title, company, location, description, startDate, endDate, isCurrent } = await request.json();

        if (!title || !company || !startDate) {
            return NextResponse.json({ error: "Title, company, and start date required" }, { status: 400 });
        }

        const exp = await prisma.experience.create({
            data: {
                userId,
                title,
                company,
                location: location || null,
                description: description || null,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                isCurrent: isCurrent || false
            }
        });

        return NextResponse.json(exp, { status: 201 });
    } catch (err) {
        console.error("create experience error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
