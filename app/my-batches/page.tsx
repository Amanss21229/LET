import Nav from "@/components/Nav";import {currentUser} from "@/lib/guards";import {prisma} from "@/lib/prisma";import Link from "next/link";
export const dynamic="force-dynamic";
export default async function My(){const u=await currentUser();if(!u)return <><Nav/><main className="wrap"><h1>My Batches</h1><p>Please 
  <a
        className="yellow"
    href="/api/auth/signin/google?callbackUrl=/my-batches"
    >
    login with Google
  </a>
  .</p></main></>;const rows=await prisma.batchAccess.findMany({where:{userId:u.id},include:{batch:true}});return <><Nav/><main className="wrap"><h1>My Batches</h1><div className="grid">{rows.map(r=><Link className="card" href={`/batches/${r.batchId}`} key={r.id}><h3>{r.batch.title}</h3><p className="yellow">✓ Full Access</p></Link>)}</div>{!rows.length&&<p className="muted">You don't have access to any batch yet.</p>}</main></>}
