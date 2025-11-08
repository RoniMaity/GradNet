import { NextResponse } from "next/server";
import prisma from "../../../../../../libs/prisma";
import { authenticateRequest } from "../../../../../../libs/auth";

// GET all experiences for a user
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        const experiences = await prisma.experience.findMany({
            where: { userId },
            orderBy: [
                { isCurrent: 'desc' },
                { startDate: 'desc' }
            ]
        });

        return NextResponse.json(experiences);
    } catch (error) {
        console.error("Error fetching experiences:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST create a new experience
export async function POST(request, { params }) {
    try {
        const requestingUser = authenticateRequest(request);
        if (!requestingUser) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const userId = parseInt(id);

        // Users can only add experiences to their own profile
        if (requestingUser.id !== userId) {
            return NextResponse.json(
                { error: "You can only add experiences to your own profile" },
                { status: 403 }
            );
        }

        const data = await request.json();
        const { title, company, location, description, startDate, endDate, isCurrent } = data;

        if (!title || !company || !startDate) {
            return NextResponse.json(
                { error: "Title, company, and start date are required" },
                { status: 400 }
            );
        }

        const experience = await prisma.experience.create({
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

        return NextResponse.json(experience, { status: 201 });
    } catch (error) {
        console.error("Error creating experience:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
