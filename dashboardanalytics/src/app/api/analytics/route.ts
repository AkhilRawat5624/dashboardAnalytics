import dbconnect from "@/lib/db";
import { NextResponse } from "next/server";



export async function GET(req:Request) {
    try {
        await dbconnect();
        const {searchParams} = new URL(req.url);
        const period = searchParams.get("period");
    } catch (error) {
        
    }
}