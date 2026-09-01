import { NextResponse } from "next/server";import { prisma } from "@/lib/prisma";import { cookies } from "next/headers";
const admin=async()=> (await cookies()).get("let_admin")?.value==="true";
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){if(!await admin())return NextResponse.json({error:"Forbidden"},{status:403});const {id}=await params;const b=await req.json();
 if(b.action==="section") return NextResponse.json(await prisma.batchSection.create({data:{batchId:id,kind:b.kind,title:b.title,sortOrder:b.sortOrder||0}}));
 if(b.action==="item") return NextResponse.json(await prisma.contentItem.create({data:{sectionId:b.sectionId,title:b.title,url:b.url,fileType:b.fileType||null,scheduledAt:b.scheduledAt?new Date(b.scheduledAt):null}}));
 if(b.action==="notification") return NextResponse.json(await prisma.notification.create({data:{batchId:id,text:b.text||null,attachmentUrl:b.attachmentUrl||null,attachmentType:b.attachmentType||null}}));
 return NextResponse.json({error:"Invalid action"},{status:400});
}
