"use client"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ReactNode } from "react";

// this client helps in caching api data
const client  = new QueryClient();

const Providers = ({children}: {children: ReactNode}) => {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

export default Providers;