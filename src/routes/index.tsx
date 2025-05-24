import { useAuth } from '@solid-mediakit/auth/client'

export default function Home() {
  const auth = useAuth()

  return <main>{auth.session()?.user?.name}</main>
}
