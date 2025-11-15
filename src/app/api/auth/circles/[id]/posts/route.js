import { NextResponse } from "next/server";
import prisma from "../../../../../../libs/prisma";
import { verifyJWT } from "../../../../../../libs/jwt";

export async function GET(req, { params }) {
    const { id } = await params;
    const circleId = parseInt(id);
    
    // Get current user ID from token if available
    let currentUserId = null;
    try {
        const token = req.cookies.get("token")?.value;
        if (token) {
            const payload = verifyJWT(token);
            if (payload) {
                currentUserId = payload.userId;
            }
        }
    } catch (error) {
        // Continue without user context
    }
    
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
            circle: {
                select: {
                    id: true,
                    name: true,
                },
            },
            _count: {
                select: { likes: true, comments: true }
            },
            likes: currentUserId ? {
                where: {
                    userId: currentUserId
                }
            } : false
        },
    });
    
    // Add isLiked field
    const postsWithLikeStatus = posts.map(post => ({
        ...post,
        isLikedByCurrentUser: currentUserId ? post.likes.length > 0 : false,
        likes: undefined
    }));
    
    return NextResponse.json(postsWithLikeStatus);
}

export async function POST(req, { params }) {
    const { id } = await params;
    const circleId = parseInt(id);
    
    // Get the token from cookies
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token and get user ID
    const payload = verifyJWT(token);
    if (!payload) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const userId = payload.userId;
    const data = await req.json();
    
    // Check if circle exists
    const circle = await prisma.circle.findUnique({ 
        where: { id: circleId }
    });

    if (!circle) {
        return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    }
    
    // Check if user is a member of the circle
    const membership = await prisma.circleMember.findUnique({
        where: {
            circleId_userId: {
                circleId,
                userId
            }
        }
    });

    if (!membership) {
        return NextResponse.json({ error: "You must be a member to post in this circle" }, { status: 403 });
    }

    const post = await prisma.post.create({
        data: {
            content: data.content,
            userId: userId,
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
            circle: {
                select: {
                    id: true,
                    name: true,
                },
            },
            _count: {
                select: { likes: true, comments: true }
            }
        },
    });

    return NextResponse.json(post, { status: 201 });
}