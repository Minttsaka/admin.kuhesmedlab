/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/Nj23XOUPrkD
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/




import { LoadingState } from "@/components/LoadingState";
import SigninForm from "@/components/SigninForm";
import dynamic from "next/dynamic";
import { Suspense } from "react";

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
export default async function page() {

  const SigninForm = dynamic(() => import('@/components/SigninForm'), {
    ssr: false,
  })

  return (
 
    <Suspense fallback={<LoadingState />}>
      <SigninForm />
      </Suspense>
         
  )
}
