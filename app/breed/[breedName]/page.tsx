'use client'

import React, { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { fetchDogsByBreed } from '@/app/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/app/header/page';

export default function BreedName({ params }: any) { //TODO remove any
    const [dogList, setDogList] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showLoadMore, setShowLoadMore] = useState<boolean>(true);
    const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false); // State to control visibility of scroll-to-top button
    let bottomRef = useRef<HTMLDivElement>(null);
    const imageCount = 3;
    const router = useRouter();

    useEffect(() => {
        getDogsByBreed();

        // Event listener to check page scroll position
        window.addEventListener('scroll', handleScroll);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const breedNameForApi = params?.breedName.replace('-', '/');
    const formattedBreedName = params?.breedName
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    async function getDogsByBreed() {
        try {
            setLoading(true);
            const data = await fetchDogsByBreed(breedNameForApi, imageCount);
            if(data.message.length < 3){
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

    const loadMoreImages = async () => {
        setLoading(true);
        try {
            scrollToBottom();
            const newData = await fetchDogsByBreed(breedNameForApi, imageCount);
            if(newData.message.length < 3){
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

    const scrollToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    const handleScroll = () => {
        // If the user scrolls down more than 300px, show the scroll-to-top button, otherwise hide it
        if (window.scrollY > 300) {
            setShowScrollToTop(true);
        } else {
            setShowScrollToTop(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const goBack = () => {
        router.push('/');
    }

    return (
        <><Header/>
        <div className="container mx-auto px-6 pt-10 relative"> {/* Add 'relative' class to make positioning of scroll-to-top button easier */}
            <ToastContainer autoClose={1500} /> {/* Add the ToastContainer */}
            <div onClick={goBack}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </div>

            <h1 className="text-3xl font-light mb-10 text-center">{formattedBreedName}</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {dogList.map((imageUrl, index) => (
                    <Image
                        key={index}
                        src={imageUrl}
                        width={500}
                        height={500}
                        alt={`${formattedBreedName} ${index}`}
                        className="rounded-lg w-full h-64 object-cover max-w-md transition duration-300 ease-in-out hover:scale-110"
                    />
                ))}
            </div>
            <div />

            {loading && (
                <div>
                    <div className="flex justify-center items-center mt-4">
                        <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
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

            {/* Render the scroll-to-top button conditionally based on the state */}
            {showScrollToTop && (
                <button className="rounded-full bg-blue-600 p-3 text-xs font-medium uppercase fixed right-0 top-1/4 transform -translate-y-1/2" onClick={scrollToTop} style={{ right:0, top:"50%"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
                
            )}

            <div style={{ float: "left", clear: "both", height:"300px"}} ref={bottomRef}></div>
        </div>
        </>
    );
}