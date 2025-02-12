"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { sessionStatus } from "@/app/utils/session";

export default function withAuth(Component: any) {
    return function WithAuth(props: any) {
        const session = sessionStatus;

        useEffect(() => {
            if (!session) redirect("/");
        }, []);
        

        if (!session) return null;

        return <Component {...props}/>
    }
}