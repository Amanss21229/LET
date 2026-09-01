import { NextResponse } from "next/server";
export async function POST(req:Request){
 const {password}=await req.json();
 if(!process.env.ADMIN_PASSWORD || password!==process.env.ADMIN_PASSWORD)
   return NextResponse.json({ok:false},{status:401});
 const res=NextResponse.json({ok:true}); res.cookies.set("let_admin","true",{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*12}); return res;
}
