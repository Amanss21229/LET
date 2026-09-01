import { NextResponse } from "next/server"; import { prisma } from "@/lib/prisma"; import { cookies } from "next/headers";
const ok=async()=> (await cookies()).get("let_admin")?.value==="true";
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params; const b=await prisma.batch.findUnique({where:{id},include:{sections:{include:{items:true}},notifications:true}});return NextResponse.json(b);}
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){if(!await ok())return NextResponse.json({error:"Forbidden"},{status:403});const {id}=await params;const d=await req.json();return NextResponse.json(await prisma.batch.update({where:{id},data:d}));}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){if(!await ok())return NextResponse.json({error:"Forbidden"},{status:403});const {id}=await params;await prisma.batch.delete({where:{id}});return NextResponse.json({ok:true});}
