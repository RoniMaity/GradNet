import { NextResponse } from "next/server";
import prisma from "../../../../../libs/prisma";


export async function GET(req, { params }) {

    const { id } = await params;
    const postId = parseInt(id);
    
    const post = await prisma.post.findUnique({
        where: { id: postId },
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
                    description: true,
                },
            },
            comments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profilePic: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
            likes: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            media: true,
        },
    });
    
    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    return NextResponse.json(post);
}

export async function PATCH(req, { params }) {
    const { id } = await params;
    const postId = parseInt(id);
    const data = await req.json();
    
    const existingPost = await prisma.post.findUnique({
        where: { id: postId },
    });
    
    if (!existingPost) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    const updateData = {};
    if (data.content) updateData.content = data.content;
    
    const post = await prisma.post.update({
        where: { id: postId },
        data: updateData,
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

export async function DELETE(req, { params }) {
    const { id } = await params;
    const postId = parseInt(id);
    
    const existingPost = await prisma.post.findUnique({
        where: { id: postId },
    });
    
    if (!existingPost) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    await prisma.post.delete({ 
        where: { id: postId } 
    });
    
    return NextResponse.json({ message: "Post deleted successfully" });
}
