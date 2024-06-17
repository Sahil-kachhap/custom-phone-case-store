import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/db";
import { formatPrice } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import StatusDropdown from "./StatusDropdown";

const Page = async () => {
  const user = await currentUser();
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  if (!user || ADMIN_EMAIL !== user.primaryEmailAddress?.emailAddress) {
    return notFound();
  }

  const order = await db.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      User: true,
      shippingAddress: true,
    },
  });

  const lastWeekRevenue = await db.order.aggregate({
    where: {
        isPaid: true,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    _sum: {
        amount: true,
    },  
  })

  const lastMonthRevenue = await db.order.aggregate({
    where: {
        isPaid: true,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    _sum: {
        amount: true,
    },  
  })

  const WEEKLY_GOAL = 500;
  const MONTHLY_GOAL = 2500;

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
        <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
            <div className="flex flex-col gap-16">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Last Week</CardDescription>
                            <CardTitle className="text-4xl">{formatPrice(lastWeekRevenue._sum.amount ?? 0)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                               of {formatPrice(WEEKLY_GOAL)} goal
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Progress value={(lastWeekRevenue._sum.amount ?? 0)/WEEKLY_GOAL*100}/>
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Last Month</CardDescription>
                            <CardTitle className="text-4xl">{formatPrice(lastMonthRevenue._sum.amount ?? 0)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                               of {formatPrice(MONTHLY_GOAL)} goal
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Progress value={(lastMonthRevenue._sum.amount ?? 0)/MONTHLY_GOAL*100}/>
                        </CardFooter>
                    </Card>
                </div>

                <h1 className="text-4xl font-bold tracking-tight">Incoming Orders</h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="hidden sm:table-cell">Purchase date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.map((item) => (
                            <TableRow key={item.id} className="bg-accent">
                                <TableCell>
                                    <div className="font-medium">
                                        {item.shippingAddress?.name}
                                    </div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        {item.User?.email}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <StatusDropdown id={item.id} orderStatus={item.status}/>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{item.createdAt.toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">{formatPrice(item.amount)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
  );
};

export default Page;
//10:56:43
