import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJWT } from '../../libs/jwt'
import LoginForm from './signinForm'

export default async function LoginPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (token) {
        const user = verifyJWT(token)
        if (user) {
            redirect('/dashbored')
        } else {
            redirect('/signin')
        }
    }

    return <LoginForm />
}