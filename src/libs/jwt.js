import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET


const signJWT = (payload, secret = SECRET, options = { expiresIn: '30d' }) => {
  return jwt.sign(payload, secret, options); 
}


const verifyJWT = (token) => {
  try {
    // console.log("Verifying token:", token)
    return jwt.verify(token, SECRET)
  } catch (err) {
    console.log(err)
    return null;
  }
}


export { signJWT, verifyJWT };
