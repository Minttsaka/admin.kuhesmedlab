
import GlobalSideBar from "@/components/GlobalSideBar";
import TopBar from "@/components/TopBar";
import SupportChat from "@/components/SupportChat";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@prisma/client";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session:any = await getServerSession(authOptions);
  const sessionUser= session.user as User
  return (
    <div className="flex">
      <GlobalSideBar />
      <div className="overflow-y-auto h-screen w-full">
        <TopBar />
      {children}
      <SupportChat user={sessionUser!} />
      </div>
    </div>
  )
}
