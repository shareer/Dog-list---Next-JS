export async function fetchDogs() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        if (!response.ok) {
            throw new Error('Failed to fetch dog images');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching dog images:', error);
        // You may want to handle or log the error in a more appropriate way
        throw error; // Re-throwing the error to be handled by the caller
    }
}


export async function fetchDogsByBreed(breed: string, count:number) {
    try {
        const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random/${count}`);
        if (!response.ok) {
            throw new Error('Failed to fetch dog images');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching dog images:', error);
        // You may want to handle or log the error in a more appropriate way
        throw error; // Re-throwing the error to be handled by the caller
    }
}
