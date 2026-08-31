import { NextResponse } from "next/server"; import { v2 as cloudinary } from "cloudinary";
cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});
export async function POST(req:Request){
 const form=await req.formData(); const file=form.get("file") as File|null; if(!file)return NextResponse.json({error:"No file"},{status:400});
 const buf=Buffer.from(await file.arrayBuffer()); const data=`data:${file.type};base64,${buf.toString("base64")}`;
 const result=await cloudinary.uploader.upload(data,{resource_type:"auto",folder:"LET"});
 return NextResponse.json({url:result.secure_url,type:file.type});
}
