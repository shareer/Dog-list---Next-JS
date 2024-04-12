'use client'

import { useState, useEffect } from "react";
import { fetchDogs } from "./api";
import Image from "next/image";
import Link from "next/link";

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
    <main className="flex min-h-screen flex-col items-center p-24">
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <div className="flex justify-center items-center mt-4">
            <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : dogImage && (
        <div>
          <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <Link href={`breed/${extractBreedName(dogImage)}`}>
              <Image
                src={dogImage}
                width={500}
                height={500}
                alt={extractBreedName(dogImage) || "Random Dog"}
                className="rounded md:h-72 w-full object-cover relative"
                style={{ boxShadow: '0 0 10px rgba(255, 255, 255, 0.5) inset' }}
              />
            </Link>
          </div>
          <div className="p-5 text-center">
            <h5 className="mb-2 text-2xl tracking-tight dark:text-white">
              {formatBreedName(extractBreedName(dogImage) ?? '')}
            </h5>
          </div>
        </div>
      )}

      {<button onClick={generateRandomDog} className="mt-20 bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
        Generate Dog
      </button>}
    </main>
  );
}
