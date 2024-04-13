'use client'

import { useState, useEffect } from "react";
import { fetchDogs } from "./api";
import Image from "next/image";
import Link from "next/link";
import Header from "./header/page";

export default function DogsPage() {
  const [dogImage, setDogImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);



  useEffect(() => {
    generateRandomDog();
  }, [])

  const generateRandomDog = async () => {
    setLoading(true);
    try {
      const data = await fetchDogs();
      setDogImage(data?.message);
    } catch (error) {
      console.error('Error generating random dog:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractBreedName = (url: string): string | null => {
    const match = url.match(/breeds\/([^/]+)/);
    return match ? match[1] : null;
  };

  const formatBreedName = (breedName: string) => {
    return breedName
      .split("-")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-24">
        <div className="h-[300px] w-[400px]">
          {loading ? (
            <div>
              <div className="flex justify-center items-center mt-[100px]">
                <svg aria-hidden="true" className="animate-spin h-10 w-10 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 014.707 7.22l-1.393 1.392A10.02 10.02 0 002 12c0 5.523 4.477 10 10 10v-4c-1.65 0-3.213-.64-4.387-1.793z"></path>
                </svg>
                <span>Loading...</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="max-w-sm rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                {dogImage && <Link href={`breed/${extractBreedName(dogImage)}`}>
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
                </button> }
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
