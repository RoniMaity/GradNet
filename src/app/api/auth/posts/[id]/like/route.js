import { NextResponse } from "next/server";
import prisma from "../../../../../../libs/prisma";
import { verifyJWT } from "../../../../../../libs/jwt";

export async function POST(req, { params }) {
    try {
        // Await params to get the id
        const { id } = await params;
        
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

        const postId = parseInt(id);
        const userId = payload.userId;

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Check if user already liked the post
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId
                }
            }
        });

        if (existingLike) {
            // Unlike the post
            await prisma.like.delete({
                where: {
                    postId_userId: {
                        postId,
                        userId
                    }
                }
            });

            // Get updated like count
            const likesCount = await prisma.like.count({
                where: { postId }
            });

            return NextResponse.json({ 
                liked: false, 
                likesCount,
                message: "Post unliked" 
            });
        } else {
            // Like the post
            await prisma.like.create({
                data: {
                    postId,
                    userId
                }
            });

            // Get updated like count
            const likesCount = await prisma.like.count({
                where: { postId }
            });

            return NextResponse.json({ 
                liked: true, 
                likesCount,
                message: "Post liked" 
            });
        }
    } catch (error) {
        console.error("Like error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// GET endpoint to check if user has liked a post
export async function GET(req, { params }) {
    try {
        // Await params to get the id
        const { id } = await params;
        
        const token = req.cookies.get("token")?.value;
        
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const postId = parseInt(id);
        const userId = payload.userId;

        const like = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId
                }
            }
        });

        const likesCount = await prisma.like.count({
            where: { postId }
        });

        return NextResponse.json({ 
            liked: !!like,
            likesCount
        });
    } catch (error) {
        console.error("Check like error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
