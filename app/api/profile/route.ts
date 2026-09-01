import { NextResponse } from "next/server";
import { requireUser } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
export async function PATCH(req:Request){
 try{ const u=await requireUser(); const b=await req.json();
 const user=await prisma.user.update({where:{id:u.id},data:{name:b.name,phone:b.phone,className:b.className,profileComplete:!!(b.name&&b.phone&&b.className)}});
 return NextResponse.json(user);
 }catch{return NextResponse.json({error:"Unauthorized"},{status:401});}
}
