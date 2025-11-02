import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJWT } from '../../libs/jwt'
import Dashboard from './Dashboard'

export default async function Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/signup')
  }

  const user = await verifyJWT(token)
  if (!user) {
    redirect('/signup')
  }

  return <Dashboard />
}
