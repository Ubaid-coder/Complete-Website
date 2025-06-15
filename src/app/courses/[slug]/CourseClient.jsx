'use client';
import Allcourses from '../../../components/Courses/Allcourses';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from 'next/link';
import Loader from '../../../components/Loader/Checking-Payment-Loader.jsx';

export default function CoursePage() {

    const params = useParams();
    const slug = params.slug;
    const course = Allcourses.find((c) => c.url === slug);
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    const [loadingPurchase, setLoadingPurchase] = useState(true);
    const [hasPurchased, setHasPurchased] = useState(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        const checkPurchase = async () => {
            try {
                const res = await fetch(`/api/verify-purchase?email=${session?.user.email}&course=${slug}`);
                const data = await res.json();
                setHasPurchased(data.purchased);

            } catch (error) {
                console.error("Error checking purchase:", err);
            } finally {
                setLoadingPurchase(false);

            }
        };

        if (session?.user?.email) {
            checkPurchase();
        }
    }, [session, status, course]);

    const handleCheckout = async () => {
        const stripe = await stripePromise;

        const res = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: course.url,
                title: course.title,
                image: course.image,
                price: course.discountprice.replace(/[^0-9.-]+/g, ''),

            }),
        });

        const data = await res.json();

        if (data?.url) {

            window.location.href = data.url;
        } else {
            console.error("Stripe session not created: ", data); // ❌ This is only if no URL
        }

    };


    if (!course) {
        return (
            <div className="min-h-screen bg-[#0d1324] flex items-center justify-center px-4">
                <div className="text-center text-white">
                    <h2 className="text-3xl font-semibold mb-2">❌ Course Not Found</h2>
                    <p className="text-gray-400">Please check the URL or select a valid course level.</p>
                </div>
            </div>
        );
    }

    if (status === "loading" && loadingPurchase === true) {
        return (
            <Loader />
        )

    }

    return (
        <div className="min-h-screen bg-[#0d1324] text-white px-6 py-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-12 text-cyan-300 text-center">{course.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
                {/* Left Side - Course Details */}
                <motion.div
                    className="w-full"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Image
                        src={course.image}
                        width={800}
                        height={500}
                        alt={course.title}
                        className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-lg mb-6"
                    />

                    <div className="space-y-4 text-gray-200">

                        <p><strong className="text-white">Duration:</strong> {course.duration}</p>
                        <p className="text-gray-300">{course.description}</p>
                    </div>
                </motion.div>

                {/* Right Side - Stripe Checkout */}
                <motion.div
                    className="w-full"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-white/10">
                        <h2 className="text-2xl font-semibold mb-4 text-white">💳 Secure Checkout</h2>

                        <p className="mb-2 text-gray-300">Course: <span className="text-white font-semibold">{course.title}</span></p>

                        <p className="mb-4 text-gray-300">Duration: <span className="text-white">{course.duration}</span></p>

                        <p className="text-xl mb-6">
                            <span className="line-through text-red-400">{course.price}</span>{' '}
                            <span className="text-green-400 font-bold text-2xl">{course.discountprice}</span>
                        </p>

                        {/* Stripe button placeholder */}
                        {status === "unauthenticated" ? (
                            <button className="w-full bg-gradient-to-r from-purple-400 to-red-500 text-black font-semibold py-3 rounded-md hover:scale-105 transition cursor-pointer">
                                <Link href={`/sign-in`}>Log-In</Link>
                            </button>
                        ) :
                            loadingPurchase ? (
                                <button className="w-full bg-gray-700 text-white font-semibold py-3 rounded-md cursor-not-allowed animate-pulse">
                                    Checking purchase...
                                </button>
                            ) :
                                hasPurchased ? (

                                    <button className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-black font-semibold py-3 rounded-md hover:scale-105 transition cursor-pointer">
                                        <Link href={`/`}>View Course</Link>
                                    </button>


                                ) : (
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-black font-semibold py-3 rounded-md hover:scale-105 transition cursor-pointer"
                                    >
                                        Pay with Stripe 💳
                                    </button>
                                )}
                        <div className="mt-6 text-sm text-gray-400 space-y-2">
                            <p> Instant Access After Payment</p>
                            <p> 100% Secure Payment via Stripe</p>
                            <p> Life time Access</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
