'use client';

import Image from 'next/image';
import Allcourses from './Allcourses.js';
import Link from 'next/link.js';
import { AlarmClock, Gem, ChevronDown } from 'lucide-react';
import { Fab } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {useSearchParams } from 'next/navigation.js';


export default function Cards() {
    const [Level, setLevel] = useState('All');
    const [open, setOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(6);


    const courseLevel = ['All', 'Easy', 'Medium', 'Hard'];

    const handleClick = (lev) => {
        setLevel(lev);
        setOpen(false);
        setVisibleCount(6); // Reset count on filter change
    };

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 3);
    };

    const filteredCourses = Allcourses.filter((course) =>
        Level === 'All' ? true : course.level === Level
    );


    return (
        <section className='relative py-10'>
            {/* Dropdown Filter */}
            <div className="relative w-60  mb-10">
                <div
                    onClick={() => setOpen(!open)}
                    className="bg-white/10 backdrop-blur-lg text-white border border-white/20 rounded-xl px-5 py-3 flex items-center justify-between cursor-pointer hover:border-[#4EE2EC] transition-all"
                >
                    <span className="capitalize">{Level === 'All' ? 'Select Level' : Level}</span>
                    <ChevronDown
                        size={20}
                        className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                    />
                </div>

                {open && (
                    <ul className="absolute top-full w-full mt-2 bg-[#11172b] text-white border border-white/20 rounded-xl shadow-xl z-10 overflow-hidden">
                        {courseLevel.map((level) => (
                            <li
                                key={level}
                                onClick={() => handleClick(level)}
                                className="px-5 py-3 hover:bg-[#4EE2EC] hover:text-[#11172b] transition-all cursor-pointer capitalize"
                            >
                                {level}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Heading */}
            <h1 className="text-center text-4xl md:text-5xl italic font-extrabold text-white mb-8 tracking-wide">
                Premium Courses <Gem size={36} className="inline-block text-[#4EE2EC]" />
            </h1>

            {/* Cards */}
            <div className='flex justify-around flex-wrap'>
                {filteredCourses.slice(0, visibleCount).map((course, i) => (
                    <div
                        key={i}
                        className='hover:bg-slate-200 shadow-2xl relative bg-white h-[500px] w-96 border border-black mt-10 m-5 rounded-[10px] p-1.5 transition-shadow ease-in'
                    >
                        <div className='absolute right-[-10] top-[-10] z-10'>
                            <Fab className='opacity-55' size="medium" color="info" aria-label="add">
                                {course.level}
                            </Fab>
                        </div>
                        <Image
                            src={course.image}
                            width={1000}
                            height={1000}
                            alt='Course'
                            loading='lazy'
                            className="w-full h-56 rounded-[10px] object-cover"
                        />
                        <h1 className='text-xl italic text-shadow-2xs text-center py-5'>{course.title}</h1>

                        <div className='flex justify-center'>
                            <div className='absolute left-10 bottom-20'>
                                <AlarmClock /> {course.duration}
                            </div>
                            <div className='absolute right-10 bottom-20 text-xl italic'>
                                <span className='line-through text-[#d44c59] text-xl font-bold'>{course.price}</span>
                                <span className='text-green-500 font-bold text-2xl'>{course.discountprice}</span>
                            </div>
                                <Link
                                    href={`courses/${course.url}`}
                                    className='absolute bottom-5 w-[80%] rounded-xl text-center bg-[#035dab] text-white p-[8px] hover:opacity-85'
                                >
                                   View Course
                                </Link>

                        </div>
                    </div>
                ))}
            </div>

            {/* Load More */}
            {visibleCount < filteredCourses.length && (
                <div className="flex justify-center mt-10">
                    <button
                        onClick={handleLoadMore}
                        className="px-6 py-3 bg-[#4EE2EC] text-black font-bold rounded-lg hover:bg-white hover:text-[#11172b] transition-all"
                    >
                        Load More
                    </button>
                </div>
            )}
        </section>

    )
}
