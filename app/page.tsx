import { Suspense } from 'react'
import ShoppingWebsite from '../components/ShoppingWebsite'
import Loading from './loading'

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <ShoppingWebsite />
    </Suspense>
  )
}


