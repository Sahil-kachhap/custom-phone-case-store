"use server"

import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";

export const getPaymentStatus = async ({orderId}: {orderId: string}) => {
    const user = await currentUser();

    if(!user?.id || !user.emailAddresses){
        throw new Error("You need to be logged in to view this page");
    }

    const order = await db.order.findFirst({
        where: {id: orderId, userId: user.id},
        include: {
            BillingAddress: true,
            shippingAddress: true,
            configuration: true,
            User: true
        }
    });

    if(!order) throw new Error("This order does not exist");

    if(order.isPaid){
        return order;
    }else{
        return false;
    }
}