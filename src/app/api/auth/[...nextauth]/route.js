import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/bdconnect";
import bcrypt from 'bcryptjs';
// const userList = [
//   {username: "Dablu", password:"12345"},
//   {username: "hablu", password:"12345"},
// ]

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
  CredentialsProvider({
    // "Sign in with...")
    name: "Email & Password",
  
    credentials: {
      email: { label: "Email", type: "email", placeholder: "Enter Email" },
      password: { label: "Password", type: "password", placeholder: 'Enter Password' },
      // secretCode: {
      //   label:"Secret Code",
      //   type: "number",
      //   placeholder: "enter code"
      // },
    },
    async authorize(credentials, req) {
    const {email, password, secretCode} = credentials;
       
    // const user = userList.find(u => u.username == username);
    const user = await dbConnect("users").findOne({email})
    
    if (!user) {
      return null
    }
    // const isPasswordOk = user.password == password;
const isPasswordOk = await bcrypt.compare(password, user?.password)
    if (isPasswordOk) {
      return user;
    }
    //my own login logic
    
      return null;
    },
  })
],
callbacks: {
  async signIn({ user, account, profile, email, credentials }) {
    return true
  },
  // async redirect({ url, baseUrl }) {
  //   return baseUrl
  // },
  async session({ session, token, user }) {
    if (token) {
      session.role = token.role;
    }
    return session
  },
  async jwt({ token, user, account, profile, isNewUser }) {
    if (user) {
      token.email=user.email,
      token.role=user.role
    }
    return token
  }
}
}

const handler =  NextAuth(authOptions)
export { handler as GET, handler as POST }