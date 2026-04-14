"use server"
import bcrypt from 'bcryptjs';
import { dbConnect } from "@/lib/bdconnect"

export const postUser = async (payload)=>{
    console.log(payload)
    //0- validate payload
    if (!payload.email) {
        return 
    }

    //1 - check user exist or not

    const isExist = await dbConnect("users").findOne({email:payload.email});
    if (isExist) {
        return {
            success: false,
            message: "user already existed"
        }
    }

const hashPassword = await bcrypt.hash(payload.password,10);


    //2 - create new user
    const newUser = {
        ...payload,
        createAt: new Date().toISOString(),
        role: "user",
        password:hashPassword
    }
    console.log(newUser)
    //3 - send user to database

    const result = await dbConnect("users").insertOne(newUser);
    if (result.acknowledged) {
        return {
            status: true,
            message: `user create ${result.insertedId.toString()}`
        }
    } else{
        return {success: false,
        message: `Something went wrong.try again`
}
    }
}