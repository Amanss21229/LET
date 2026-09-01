import { NextResponse } from "next/server"; import { prisma } from "@/lib/prisma"; import { cookies } from "next/headers";
function admin(){return cookies().then(c=>c.get("let_admin")?.value==="true")}
export async function GET(){return NextResponse.json(await prisma.batch.findMany({orderBy:{createdAt:"desc"}}));}
export async function POST(req:Request){
 if(!await admin())return NextResponse.json({error:"Forbidden"},{status:403});
 const b=await req.json(); const x=await prisma.batch.create({data:{title:b.title,className:b.className,medium:b.medium,teacherName:b.teacherName||"Aman",imageUrl:b.imageUrl||null,startDate:b.startDate?new Date(b.startDate):null,endDate:b.endDate?new Date(b.endDate):null,syllabusDate:b.syllabusDate?new Date(b.syllabusDate):null,price:Number(b.price||0),about:b.about||"",customPoints:b.customPoints||[],buyEnabled:b.buyEnabled!==false}});return NextResponse.json(x);
}
