import { cookies } from 'next/headers'
import { verifyJWT } from '../../libs/jwt'
import SignUpForm from "./SignUpForm"
import { redirect } from 'next/navigation'

export default async function SignUpPage() {
    const cookieStore = await cookies()
    // console.log(await cookies())
    // console.log(cookieStore)
    const token = cookieStore.get('token')?.value
    // console.log("Token from cookies:", token)

    if (token) {
        const user = verifyJWT(token)
        if (user) {
            redirect('/dashboard')
        } else {
            redirect('/signin')
        }

    }

    return <SignUpForm />
}