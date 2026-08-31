import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function currentUser(){
 const session=await auth(); if(!session?.user?.email) return null;
 return prisma.user.findUnique({where:{email:session.user.email}});
}
export async function requireUser(){ const u=await currentUser(); if(!u) throw new Error("UNAUTHORIZED"); return u; }
export async function hasAccess(userId:string,batchId:string){
 return !!(await prisma.batchAccess.findUnique({where:{userId_batchId:{userId,batchId}}}));
}
