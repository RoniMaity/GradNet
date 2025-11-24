import { verifyJWT } from "./jwt";
export function authenticateRequest(req) {
    
    const authHeader = req.headers.get("Authorization");
    // console.log(req.headers);
    if (!authHeader) {
        return null;
    }

    const token = authHeader.split(" ")[1];
    // console.log("Token from header:", token);
    if (!token) {
        return null;
    }

    try {
        const payload = verifyJWT(token);
        // console.log("Decoded JWT payload:", payload);
        if (!payload) {
            return null;
        }
        return { id: payload.userId, email: payload.email };
    } catch (err) {
        console.error("Invalid token", err);
        return null;
    }
}