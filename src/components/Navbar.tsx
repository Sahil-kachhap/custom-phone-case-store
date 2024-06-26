import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Navbar = async () => {
  const user = await currentUser();

  const isAdmin = user?.primaryEmailAddress?.emailAddress! === process.env.ADMIN_EMAIL;
  console.log(`IsAdmin: ${user?.emailAddresses}`);


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
                {isAdmin ? (
                  <Link
                    href={"/dashboard"}
                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                  >
                    Dashboard
                  </Link>
                ) : null}
                <UserButton />
                <Link
                  href={"/configure/upload"}
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Create Case
                  <ArrowRight className="ml-1.5 w-5 h-5" />
                </Link>
              </>
            ) : (
              <>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
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
                </SignedOut>

                <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

                <Link
                  href={"/configure/upload"}
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Create Case
                  <ArrowRight className="ml-1.5 w-5 h-5" />
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
