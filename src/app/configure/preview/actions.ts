"use server"

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/product";
import { db } from "@/db"
import { razorpay } from "@/lib/razorpay";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Order } from "@prisma/client";

export const createCheckoutSession = async ({configId}:{configId: string}) => {
    const configuration = await db.configuration.findUnique({
        where: {id: configId}
    });

    if(!configuration){
        throw new Error("No such configuration found");
    }

    //TODO: get user data from session details
    const {userId} = auth();

    //TODO: If no user found logged in throw error: "You need to be logged in"
    if(!userId){
        throw new Error("You need to be logged in");
    }
    const user = await currentUser();
    console.log(`user: ${user?.fullName}`);

    const {finish, material, model} = configuration;
    let price = BASE_PRICE;
    if(material === "polycarbonate") price += PRODUCT_PRICES.material.polycarbonate;
    if(finish === "textured") price += PRODUCT_PRICES.finish.textured;

    // check if there already exists a configuration for the currently selected order and then process to checkout
    let order: Order | undefined = undefined

    const existingOrder = await db.order.findFirst({
        where: {
            userId: userId, // get user id after getting session details above
            configurationId: configuration.id
        }
    });

    if(existingOrder){
        order = existingOrder;
    }else{
        order = await db.order.create({
            data: {
                amount: price / 100,
                userId: userId, // logged in user-id
                configurationId: configuration.id
            }
        })
    }

    const productDescription = `
        Customised Phone Case - ${model}(${material})
        This is a custom-made phone case designed specifically for your ${model}.
        Price: ₹${price / 100}
    `;

    console.log(productDescription);

    const product = await razorpay.items.create({
        "name":"Custom iphone case",
        "description": productDescription,
        "amount":price/100,
        "currency":"INR"
    });

    // const razorpaySession = await razorpay.orders.;

    return {url: ""};
}