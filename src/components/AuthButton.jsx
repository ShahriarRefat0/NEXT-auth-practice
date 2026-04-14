
'use client'
import React from "react";
import LoginButton from "./LoginButton";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const AuthButton = () => {
  const session = useSession();

  return (
    <div className="flex gap-5">
      {session.status == "authenticated" ? (
        <button className="btn" onClick={()=> signOut()}>Logout</button>
      ) : (
        <>
          <LoginButton></LoginButton>
          <Link href={"/register"} className="btn">
            Register
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButton;
