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

        const circleId = parseInt(id);
        const userId = payload.userId;

        // Check if circle exists
        const circle = await prisma.circle.findUnique({
            where: { id: circleId }
        });

        if (!circle) {
            return NextResponse.json({ error: "Circle not found" }, { status: 404 });
        }

        // Check if already a member
        const existingMember = await prisma.circleMember.findUnique({
            where: {
                circleId_userId: {
                    circleId,
                    userId
                }
            }
        });

        if (existingMember) {
            // Leave the circle
            await prisma.circleMember.delete({
                where: {
                    circleId_userId: {
                        circleId,
                        userId
                    }
                }
            });

            // Get updated member count
            const memberCount = await prisma.circleMember.count({
                where: { circleId }
            });

            return NextResponse.json({ 
                isMember: false, 
                memberCount,
                message: "Left circle successfully" 
            });
        } else {
            // Join the circle
            await prisma.circleMember.create({
                data: {
                    circleId,
                    userId,
                    role: "member"
                }
            });

            // Get updated member count
            const memberCount = await prisma.circleMember.count({
                where: { circleId }
            });

            return NextResponse.json({ 
                isMember: true, 
                memberCount,
                message: "Joined circle successfully" 
            });
        }
    } catch (error) {
        console.error("Join circle error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// GET endpoint to check if user is a member
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

        const circleId = parseInt(id);
        const userId = payload.userId;

        const member = await prisma.circleMember.findUnique({
            where: {
                circleId_userId: {
                    circleId,
                    userId
                }
            }
        });

        const memberCount = await prisma.circleMember.count({
            where: { circleId }
        });

        return NextResponse.json({ 
            isMember: !!member,
            memberCount
        });
    } catch (error) {
        console.error("Check member error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
