'use client'

import DogImage from "@/components/DogImage";
import Header from "@/components/Header";
import { Suspense } from "react";

export default function DogsPage() {
  return (
    <>
      <Suspense>
        <Header />
        <DogImage />
      </Suspense>
    </>
  );
}
