import { NextResponse } from "next/server";
import prisma from "../../../../../../libs/prisma";
import { authenticateRequest } from "../../../../../../libs/auth";

export async function GET(req, { params }) {
    const { id } = await params;
    const circleId = parseInt(id);
    const posts = await prisma.post.findMany({
        where: { circleId: circleId },
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
    });
    return NextResponse.json(posts);
}

export async function POST(req, { params }) {
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

    if (!circle) return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    
    if (circle.createdById !== user.id) {
        return NextResponse.json({ error: "Only the circle owner can post" }, { status: 403 });
    }

    const post = await prisma.post.create({
        data: {
            content: data.content,
            userId: user.id,
            circleId: circleId,
        },
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
    });

    return NextResponse.json(post);
}