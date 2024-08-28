import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";
import { prisma } from "./prisma";

interface User {
  name?: string | null;
  email?: string | null;
}

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/signin",
    signOut:"/signout",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "User Name",
          type: "text",
          placeholder: "Your User Name",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const user = await prisma.user.findUnique({
            where : {
              email: credentials?.username,
            },
        });
   
        if (!user) throw new Error("The email does not exist");
    
        if (!credentials?.password) throw new Error("Please Provide Your Password");
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
    
        if (!isPasswordCorrect) throw new Error("The password is not correct");

        if (!user.emailVerified)throw new Error ("Please verify your email first! using the link sent to your email!")
    
        const { password, ...userWithoutPass } = user;
        return userWithoutPass;
    },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },

    async session({ token, session }) {
      session.user = token.user as User;
      return session;
    },
  },
};


