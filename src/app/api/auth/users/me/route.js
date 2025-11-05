import { NextResponse } from "next/server";
import { authenticateRequest } from "../../../../../libs/auth";

export async function GET(request) {
    try {
        const requestingUser = authenticateRequest(request);
        
        if (!requestingUser) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Return the authenticated user's info
        return NextResponse.json({
            id: requestingUser.id,
            email: requestingUser.email
        });
    } catch (error) {
        console.error("Error fetching current user:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
