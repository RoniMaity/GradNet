import { NextResponse } from "next/server";
import prisma from "../../../../../../../libs/prisma";
import { authenticateRequest } from "../../../../../../../libs/auth";

// PATCH update an experience
export async function PATCH(request, { params }) {
    try {
        const requestingUser = authenticateRequest(request);
        if (!requestingUser) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const { experienceId } = await params;
        const expId = parseInt(experienceId);

        const experience = await prisma.experience.findUnique({
            where: { id: expId }
        });

        if (!experience) {
            return NextResponse.json(
                { error: "Experience not found" },
                { status: 404 }
            );
        }

        // Users can only update their own experiences
        if (requestingUser.id !== experience.userId) {
            return NextResponse.json(
                { error: "You can only update your own experiences" },
                { status: 403 }
            );
        }

        const data = await request.json();
        const { title, company, location, description, startDate, endDate, isCurrent } = data;

        const updatedExperience = await prisma.experience.update({
            where: { id: expId },
            data: {
                ...(title && { title }),
                ...(company && { company }),
                ...(location !== undefined && { location }),
                ...(description !== undefined && { description }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
                ...(isCurrent !== undefined && { isCurrent })
            }
        });

        return NextResponse.json(updatedExperience);
    } catch (error) {
        console.error("Error updating experience:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE an experience
export async function DELETE(request, { params }) {
    try {
        const requestingUser = authenticateRequest(request);
        if (!requestingUser) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const { experienceId } = await params;
        const expId = parseInt(experienceId);

        const experience = await prisma.experience.findUnique({
            where: { id: expId }
        });

        if (!experience) {
            return NextResponse.json(
                { error: "Experience not found" },
                { status: 404 }
            );
        }

        // Users can only delete their own experiences
        if (requestingUser.id !== experience.userId) {
            return NextResponse.json(
                { error: "You can only delete your own experiences" },
                { status: 403 }
            );
        }

        await prisma.experience.delete({
            where: { id: expId }
        });

        return NextResponse.json({ message: "Experience deleted successfully" });
    } catch (error) {
        console.error("Error deleting experience:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
