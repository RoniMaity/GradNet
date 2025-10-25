import { verifyJWT } from "./jwt";

export function authenticateRequest(req) {
    const authHeader = req.headers.get("Authorization");
    let token = null;

    if (authHeader) {
        token = authHeader.split(" ")[1];
    }
    
    if (!token) {
        const cookieHeader = req.headers.get("cookie");
        if (cookieHeader) {
            const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = value;
                return acc;
            }, {});
            token = cookies.token;
        }
    }

    if (!token) {
        return null;
    }

    try {
        const payload = verifyJWT(token);
        if (!payload) {
            return null;
        }
        return { id: payload.userId, email: payload.email };
    } catch (err) {
        console.error("Invalid token", err);
        return null;
    }
}