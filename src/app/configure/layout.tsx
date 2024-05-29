import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { ReactNode } from "react"

const Layout = ({children}:{children: ReactNode}) => {
    return (
        <MaxWidthWrapper className="flex flex-col flex-1">{children}</MaxWidthWrapper>
    )
}

export default Layout