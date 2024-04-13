'use client'

export default function Loader() {
    return (
        <div>
            <div className="flex justify-center items-center mt-[100px]">
                <svg aria-hidden="true" className="animate-spin h-10 w-10 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 014.707 7.22l-1.393 1.392A10.02 10.02 0 002 12c0 5.523 4.477 10 10 10v-4c-1.65 0-3.213-.64-4.387-1.793z"></path>
                </svg>
                <span>Loading...</span>
            </div>
        </div>
    )
}
