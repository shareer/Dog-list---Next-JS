'use client'
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/Loader";
import { fetchDogs } from "@/app/api";
import { URLS } from "@/utils/constant";

export default function DogImage() {
    // STATES AND CONSTANTS
    const [dogImage, setDogImage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const search = searchParams.get('breed');
    const name = searchParams.get('name');

    // USE EFFECT HOOK   
    useEffect(() => {
        if (!search) {
            generateRandomDog();
        } else {
            setDogImage(`${URLS.IMAGE_BASE_URL}/breeds/${search}/${name}`);
        }
    }, [])

    //### API METHODS ###//

    /**
     * Fetches a random dog image and navigates to the home page.
     */
    const generateRandomDog = async () => {
        setLoading(true);
        try {
            const data = await fetchDogs();
            setDogImage(data?.message);
            router.replace('/');
        } catch (error) {
            console.error('Error generating random dog:', error);
        } finally {
            setLoading(false);
        }
    };

    //### HELPER METHODS ###//

    /**
     * Extracts the breed name from a URL string containing the pattern 'breeds/<breed-name>'.
     * 
     * @param {string} url The URL string to extract the breed name from.
     * @returns {string | null} The extracted breed name, or null if not found.
     */
    const extractBreedName = (url: string): string | null => {
        const match = url.match(/breeds\/([^/]+)/);
        return match ? match[1] : null;
    };

    /**
     * Extracts the image name from a URL string.
     * 
     * @param {string} url The URL string to extract the image name from.
     * @returns {string | null} The extracted image name, or null if not found.
     */
    const extractImageName = (url: string): string | null => {
        // Split the URL by '/'
        const parts = url.split('/');
        // Return the last part which contains the image name with extension
        return parts[parts.length - 1] || null;
    }

    /**
     * Formats a breed name by capitalizing the first letter of each word and replacing hyphens with spaces.
     * 
     * @param {string} breedName The breed name to format.
     * @returns {string} The formatted breed name.
     */
    const formatBreedName = (breedName: string) => {
        return breedName
            .split("-")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <main className="flex flex-col items-center p-24">
            <div className="h-[300px] w-[360px]">
                {loading ? (
                    <Loader />
                ) : (
                    <div>
                        <div className="max-w-sm rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                            {dogImage && <Link href={`breed/${extractBreedName(dogImage)}?name=${extractImageName(dogImage)}`}>
                                <Image
                                    src={dogImage}
                                    width={500}
                                    height={500}
                                    priority={false}
                                    alt={extractBreedName(dogImage) || "Random Dog"}
                                    className="object-cover h-72 w-full shadow-lg borde rounded-md transition-transform transform hover:scale-105"
                                />
                                <div className="p-4">
                                    <h5 className="text-2xl font-semibold text-white flex justify-center items-center  rounded-lg">
                                        {formatBreedName(extractBreedName(dogImage) ?? '')}
                                    </h5>
                                </div>
                            </Link>}
                        </div>
                        <div className="p-5 text-center">
                            {dogImage && <button onClick={generateRandomDog} className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                Generate
                            </button>}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
