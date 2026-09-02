import Nav from "@/components/Nav";import Enquiry from "@/components/Enquiry";import { prisma } from "@/lib/prisma";import Link from "next/link";
export const dynamic="force-dynamic";
export default async function Home(){const batches=await prisma.batch.findMany({orderBy:{createdAt:"desc"}});return <><Nav/><main className="wrap"><section className="hero"><p className="yellow">LET • LEARN • EARN • TEACH</p><h1>Learn smarter.<br/><span className="yellow">Grow stronger.</span></h1><p className="muted">A modern learning platform by Aman.</p></section><h2>All Batches</h2><div className="grid">{batches.length?batches.map(b=><Link className="card" key={b.id} href={`/batches/${b.id}`}>
  {b.imageUrl ? (

  <img

    src={
      b.imageUrl
    }

    alt={
      b.title
    }

    className="batch-image"

  />

) : (

  <div
    className="batch-image-placeholder"
  >

    LET

  </div>

)}  
  <h3>{b.title}</h3><p className="muted">Class {b.className} • {b.medium}</p><b className="yellow">₹{b.price}</b><p><button className="btn primary">Explore Batch</button></p></Link>):<p className="muted">No batches yet. Admin can create the first batch.</p>}</div></main><Enquiry/></>}
