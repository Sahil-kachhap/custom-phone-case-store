import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";

const Navbar = () => {
  const user = false;
  const isAdmin = true;
  return (
    <nav className="sticky h-14 z-[100] inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between h-14 border-b border-zinc-200">
          <Link href={"/"} className="flex z-40 font-semibold">
            case<span className="text-green-600">canvas</span>
          </Link>
          <div className="h-full flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href={"/api/auth/logout"}
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Sign out
                </Link>
                {isAdmin ? (
                  <Link
                    href={"/api/auth/logout"}
                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                  >
                    Dashboard
                  </Link>
                ) : null}
                <Link
                  href={"/configure/upload"}
                  className={buttonVariants({ size: "sm", className: "hidden sm:flex items-center gap-1" })}
                >
                  Create Case
                  <ArrowRight className="ml-1.5 w-5 h-5"/>
                </Link>
              </>
            ) : (
                <>
                <Link
                  href={"/api/auth/register"}
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Sign up
                </Link>
                <Link
                  href={"/api/auth/login"}
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Login
                </Link>

                <div className="h-8 w-px bg-zinc-200 hidden sm:block"/>

                <Link
                  href={"/configure/upload"}
                  className={buttonVariants({ size: "sm", className: "hidden sm:flex items-center gap-1" })}
                >
                  Create Case
                  <ArrowRight className="ml-1.5 w-5 h-5"/>
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
