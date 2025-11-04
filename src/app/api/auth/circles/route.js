import { NextResponse } from "next/server";
import prisma from "../../../../libs/prisma";
import { authenticateRequest } from "../../../../libs/auth";


export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const collegeId = searchParams.get("collegeId");
        const userId = searchParams.get("userId");

        const where = {};

        if (collegeId) {
            where.collegeId = parseInt(collegeId);
        }

        if (userId) {
            where.createdById = parseInt(userId);
        }

        const circles = await prisma.circle.findMany({
            where,
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profilePic: true,
                    },
                },
                college: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                    },
                },
                _count: {
                    select: {
                        members: true,
                        posts: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(circles);
    } catch (error) {
        console.error("Error fetching circles:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


export async function POST(request) {
    try {

        const user = authenticateRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const data = await request.json();


        if (!data.name) {
            return NextResponse.json(
                { error: "Circle name is required" },
                { status: 400 }
            );
        }


        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: { collegeId: true },
        });


        const circle = await prisma.circle.create({
            data: {
                name: data.name,
                description: data.description || null,
                createdById: user.id,
                collegeId: userData?.collegeId || null,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profilePic: true,
                    },
                },
                college: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                    },
                },
            },
        });

        return NextResponse.json(circle, { status: 201 });
    } catch (error) {
        console.error("Error creating circle:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
