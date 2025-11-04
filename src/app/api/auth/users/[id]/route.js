import { NextResponse } from "next/server";
import prisma from "../../../../../libs/prisma";
import { authenticateRequest } from "../../../../../libs/auth";

export async function GET(request, { params }) {
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

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                college: true,
                posts: {
                    include: {
                        media: true,
                        likes: true,
                        comments: true,
                    },
                    orderBy: { createdAt: "desc" },
                },
                circlesCreated: true,
                circleMembers: {
                    include: {
                        circle: true,
                    },
                },
                connectionsAsStudent: {
                    include: {
                        alumni: {
                            select: {
                                id: true,
                                name: true,
                                profilePic: true,
                                role: true,
                                branch: true,
                            },
                        },
                    },
                },
                connectionsAsAlumni: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                name: true,
                                profilePic: true,
                                branch: true,
                                graduationYear: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const requestingUserData = await prisma.user.findUnique({
            where: { id: requestingUser.id },
            select: { collegeId: true },
        });

        const isSameCollege = requestingUserData?.collegeId === user.collegeId;
        const isOwnProfile = requestingUser.id === userId;

        if (!isSameCollege && !isOwnProfile) {
            return NextResponse.json(
                { error: "Access denied. You can only view profiles from your college." },
                { status: 403 }
            );
        }

        const profileData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio,
            profilePic: user.profilePic,
            branch: user.branch,
            graduationYear: user.graduationYear,
            college: user.college,
            posts: user.posts.map((p) => ({
                id: p.id,
                content: p.content,
                media: p.media,
                likesCount: p.likes.length,
                commentsCount: p.comments.length,
                createdAt: p.createdAt,
            })),
            circlesCreated: user.circlesCreated,
            circlesJoined: user.circleMembers.map((cm) => cm.circle),
            connections: {
                asStudent: user.connectionsAsStudent.map((c) => ({
                    id: c.id,
                    alumni: c.alumni,
                    status: c.status,
                })),
                asAlumni: user.connectionsAsAlumni.map((c) => ({
                    id: c.id,
                    student: c.student,
                    status: c.status,
                })),
            },
            isOwnProfile,
            canEdit: isOwnProfile,
        };

        return NextResponse.json(profileData);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(request, { params }) {
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


        if (requestingUser.id !== userId) {
            return NextResponse.json(
                { error: "You can only update your own profile" },
                { status: 403 }
            );
        }

        const data = await request.json();


        const allowedFields = ['name', 'bio', 'profilePic', 'branch', 'graduationYear'];
        const updateData = {};

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "No valid fields to update" },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                profilePic: true,
                branch: true,
                graduationYear: true,
                role: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
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


        if (requestingUser.id !== userId) {
            return NextResponse.json(
                { error: "You can only delete your own account" },
                { status: 403 }
            );
        }


        await prisma.user.delete({
            where: { id: userId }
        });

        return NextResponse.json(
            { message: "Account deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
