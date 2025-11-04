import { NextResponse } from "next/server";
import prisma from "../../../../libs/prisma";


export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const includeCirclePosts = searchParams.get("includeCirclePosts") === "true";
    
    const where = {};
    
    
    if (userId) {
        where.userId = parseInt(userId);
    }
    
    
    if (!includeCirclePosts) {
        where.circleId = null;
    }
    
    const posts = await prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { 
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    profilePic: true,
                },
            },
            circle: {
                select: {
                    id: true,
                    name: true,
                },
            },
            _count: {
                select: { 
                    likes: true, 
                    comments: true,
                    media: true 
                }
            }
        },
    });
    
    return NextResponse.json(posts);
}

export async function POST(req) {
    const data = await req.json();
    
    if (!data.userId || !data.content) {
        return NextResponse.json(
            { error: "userId and content are required" }, 
            { status: 400 }
        );
    }
    
    const post = await prisma.post.create({
        data: {
            content: data.content,
            userId: data.userId,
            
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    profilePic: true,
                },
            },
        },
    });
    
    return NextResponse.json(post, { status: 201 });
}
