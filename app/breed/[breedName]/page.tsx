'use client'

import React, { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchDogsByBreed } from '@/app/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import { placeholderImage } from '@/utils/constant';


export default function BreedName({ params }: any) {
    // STATES AND CONSTANTS
    const [dogList, setDogList] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showLoadMore, setShowLoadMore] = useState<boolean>(true);
    const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);
    const router = useRouter();
    const searchedParams = useSearchParams();
    let bottomRef = useRef<HTMLDivElement>(null);
    const nameValue = searchedParams.get('name') ?? '';
    const imageCount = 3;
    const breedNameForApi = params?.breedName.replace('-', '/');
    const formattedBreedName = params?.breedName
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");


    // USE EFFECT HOOK        
    useEffect(() => {
        getDogsByBreed();

        // Event listener to check page scroll position
        window.addEventListener('scroll', handleScroll);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    //### API METHODS ###//

    /**
     * Fetches dog images by breed name and updates the component state accordingly.
     */
    const getDogsByBreed = async () => {
        try {
            setLoading(true);
            const data = await fetchDogsByBreed(breedNameForApi, imageCount);
            if (data.message.length < 3) {
                setShowLoadMore(false); // hide the 'Show more' button if no more images to load
            }
            setDogList(data.message);
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching dog images:', error);
        } finally {
            setLoading(false);
        }
    }

    /**
    * Fetches additional dog images by breed name and appends them to the existing list.
    */
    const loadMoreImages = async () => {
        setLoading(true);
        try {
            scrollToBottom();
            const newData = await fetchDogsByBreed(breedNameForApi, imageCount);
            if (newData.message.length < 3) {
                setShowLoadMore(false); // hide the 'Show more' button if no more images to load
            }
            setDogList(prev => [...prev, ...newData.message]);
            toast.success('Images fetched successfully!');
        } catch (error) {
            console.error('Error fetching more dog images:', error);
            toast.error('Error fetching dog images');
        } finally {
            setLoading(false);
        }
    };


    //### HELPER METHODS ###//

    /**
     * Scrolls the viewport to the bottom of the page or container with smooth behavior.
     */
    const scrollToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    /**
     * Handles the scroll event to determine whether to show or hide the scroll-to-top button.
     */
    const handleScroll = () => {
        // If the user scrolls down more than 300px, show the scroll-to-top button, otherwise hide it
        if (window.scrollY > 300) {
            setShowScrollToTop(true);
        } else {
            setShowScrollToTop(false);
        }
    };

    /**
     * Scrolls the viewport to the top of the page with smooth behavior.
     */
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    /**
     * Navigates back to the previous page with optional query parameters.
     */
    const navigateToHome = () => {
        const queryParams = new URLSearchParams({ breed: params?.breedName, name: nameValue }).toString();
        const path = `/?${queryParams}`;
        router.push(path);
    }

    return (
        <><Header />
            <div className="container mx-auto px-6 pt-10 relative">
                <ToastContainer autoClose={1500} />
                <div className='flex items-center justify-between mb-10'>
                    <div className="cursor-pointer flex items-center hover:text-blue-500" onClick={navigateToHome}>
                        <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-lg">Back</span>
                    </div>

                    <div className="flex items-center justify-center flex-grow">
                        <h1 className="text-2xl sm:text-3xl font-light">{formattedBreedName}</h1>
                    </div>

                    <div className="ml-auto" onClick={() => router.push('/')}>
                        <svg className="h-8 w-8 text-white hover:text-blue-500 cursor-pointer" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <polyline points="5 12 3 12 12 3 21 12 19 12" />
                            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                        </svg>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {dogList.map((imageUrl, index) => (
                        <Image
                            key={index}
                            src={imageUrl}
                            width={500}
                            height={500}
                            priority={true}
                            placeholder='blur'
                            alt={`${formattedBreedName} ${index}`}
                            blurDataURL={placeholderImage}
                            className="rounded-lg w-full h-64 object-cover max-w-md transition duration-300 ease-in-out hover:scale-110"
                        />
                    ))}
                </div>
                <div />

                {loading && (
                    <Loader />
                )}

                {(!loading && showLoadMore) && (
                    <div className="mt-10 flex justify-center">
                        <button onClick={loadMoreImages} className="mt-4 font-light bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded shadow">
                            Show More
                        </button>
                    </div>
                )}

                {(!loading && !showLoadMore) && (
                    <div className="mt-10 flex justify-center">
                        <span> No More Images to Show</span>
                    </div>
                )}

                {showScrollToTop && (
                    <button className="rounded-full bg-blue-600 p-3 text-xs font-medium uppercase fixed right-0 top-1/4 transform -translate-y-1/2" onClick={scrollToTop} style={{ right: 0, top: "50%" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>

                )}

                <div style={{ float: "left", clear: "both", height: "300px" }} ref={bottomRef}></div>
            </div>
        </>
    );
}