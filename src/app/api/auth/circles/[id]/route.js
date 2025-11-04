import { NextResponse } from "next/server";
import prisma from "../../../../../libs/prisma";
import { authenticateRequest } from "../../../../../libs/auth";

export async function GET(req, { params }) {
    const { id } = await params;
    const circleId = parseInt(id);
    const circle = await prisma.circle.findUnique({
        where: { id: circleId },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    profilePic: true,
                },
            },
            posts: {
                orderBy: { createdAt: "desc" },
                include: { 
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profilePic: true,
                        },
                    },
                    _count: {
                        select: { likes: true, comments: true }
                    }
                },
            },
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profilePic: true,
                        },
                    },
                },
            },
        },
    });
    if (!circle) return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    return NextResponse.json(circle);
}

export async function PATCH(req, { params }) {
    const { id } = await params;
    const circleId = parseInt(id);
    
    const user = authenticateRequest(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await req.json();
    
    const circle = await prisma.circle.findUnique({
        where: { id: circleId }
    });
    
    if (!circle) {
        return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    }
    
    if (circle.createdById !== user.id) {
        return NextResponse.json({ error: "Only the circle owner can update it" }, { status: 403 });
    }
    
    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    
    const updatedCircle = await prisma.circle.update({
        where: { id: circleId },
        data: updateData,
    });
    return NextResponse.json(updatedCircle);
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    const circleId = parseInt(id);
    
    const user = authenticateRequest(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const circle = await prisma.circle.findUnique({
        where: { id: circleId }
    });
    
    if (!circle) {
        return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    }
    
    if (circle.createdById !== user.id) {
        return NextResponse.json({ error: "Only the circle owner can delete it" }, { status: 403 });
    }
    
    await prisma.circle.delete({ where: { id: circleId } });
    return NextResponse.json({ message: "Circle deleted successfully" });
}