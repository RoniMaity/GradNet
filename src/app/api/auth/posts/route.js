import { NextResponse } from "next/server";
import prisma from "../../../../libs/prisma";
import { verifyJWT } from "../../../../libs/jwt";


export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const includeCirclePosts = searchParams.get("includeCirclePosts") === "true";
    const sortBy = searchParams.get("sortBy") || "recent";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")) : undefined;
    
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
        // Token verification failed, continue without user context
    }
    
    const where = {};
    
    
    if (userId) {
        where.userId = parseInt(userId);
    }
    
    
    if (!includeCirclePosts) {
        where.circleId = null;
    }
    
    const posts = await prisma.post.findMany({
        where,
        take: limit,
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
            },
            media: true,
            likes: currentUserId ? {
                where: {
                    userId: currentUserId
                }
            } : false
        },
    });
    
    // Add isLiked field and format response
    const postsWithLikeStatus = posts.map(post => ({
        ...post,
        isLikedByCurrentUser: currentUserId ? post.likes.length > 0 : false,
        likes: undefined // Remove the likes array from response
    }));
    
    // Sort by likes if requested
    if (sortBy === "likes") {
        postsWithLikeStatus.sort((a, b) => b._count.likes - a._count.likes);
    } else {
        // Sort by date (most recent first)
        postsWithLikeStatus.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return NextResponse.json(postsWithLikeStatus);
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
