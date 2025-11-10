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

        const followingId = parseInt(id);
        const followerId = payload.userId;

        // Can't follow yourself
        if (followerId === followingId) {
            return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
        }

        // Check if user exists
        const userToFollow = await prisma.user.findUnique({
            where: { id: followingId }
        });

        if (!userToFollow) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        if (existingFollow) {
            // Unfollow
            await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId,
                        followingId
                    }
                }
            });

            // Get updated counts
            const followersCount = await prisma.follow.count({
                where: { followingId }
            });
            const followingCount = await prisma.follow.count({
                where: { followerId: followingId }
            });

            return NextResponse.json({ 
                isFollowing: false, 
                followersCount,
                followingCount,
                message: "Unfollowed successfully" 
            });
        } else {
            // Follow
            await prisma.follow.create({
                data: {
                    followerId,
                    followingId
                }
            });

            // Get updated counts
            const followersCount = await prisma.follow.count({
                where: { followingId }
            });
            const followingCount = await prisma.follow.count({
                where: { followerId: followingId }
            });

            return NextResponse.json({ 
                isFollowing: true, 
                followersCount,
                followingCount,
                message: "Followed successfully" 
            });
        }
    } catch (error) {
        console.error("Follow error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// GET endpoint to check if user is following
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        
        const token = req.cookies.get("token")?.value;
        
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const followingId = parseInt(id);
        const followerId = payload.userId;

        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        const followersCount = await prisma.follow.count({
            where: { followingId }
        });
        
        const followingCount = await prisma.follow.count({
            where: { followerId: followingId }
        });

        return NextResponse.json({ 
            isFollowing: !!follow,
            followersCount,
            followingCount
        });
    } catch (error) {
        console.error("Check follow error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
