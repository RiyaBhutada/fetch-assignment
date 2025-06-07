// src/pages/DogSearch.tsx
import { useEffect, useState } from "react";
import {
  fetchBreeds,
  fetchDogs,
  fetchMatch,
  searchDogs,
} from "../api/fetchApi";
import DogCard from "../components/DogCard";
import type {Location, DogWithLocation } from "../types";

// Fetch location data for multiple zip codes
async function fetchLocations(zipCodes: string[]): Promise<Location[]> {
  const response = await fetch(
    "https://frontend-take-home-service.fetch.com/locations",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(zipCodes),
    }
  );
  const locations = await response.json();
  return locations;
}

export default function DogSearch() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [dogs, setDogs] = useState<DogWithLocation[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [matchDog, setMatchDog] = useState<DogWithLocation | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchBreeds().then(setBreeds);
  }, []);


  useEffect(() => {
    async function loadDogs() {
      const res = await searchDogs(selectedBreed ? [selectedBreed] : [], page * 10);

      const dogsData = await fetchDogs(res.resultIds);
      const uniqueZipCodes: string[] = Array.from(new Set(dogsData.map((dog: DogWithLocation) => dog.zip_code)));

      const locations = await fetchLocations(uniqueZipCodes);

      // Map zip_code to location for quick access
      const locationMap = new Map<string, { city: string; state: string }>(
        locations.map(loc => [loc.zip_code? loc.zip_code: "", { city: loc.city, state: loc.state }])
      );

      // Merge city and state into each dog

      const dogsWithLocation: DogWithLocation[] = dogsData.map((dog: DogWithLocation) => {
        const location = locationMap.get(dog.zip_code);
        console.log(location?.city || "");
        return {
          ...dog,
          city: location?.city || "",
          state: location?.state || ""
        };
      });

      setDogs(dogsWithLocation);
    }

    loadDogs();
  }, [selectedBreed, page]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleMatch = async () => {
    const { match } = await fetchMatch(favorites);
    const [dog] = await fetchDogs([match]);

    // Fetch location for matched dog
    const locations = await fetchLocations([dog.zip_code]);
    const loc = locations[0];

    setMatchDog({
      ...dog,
      city: loc?.city || "",
      state: loc?.state || "",
    });
  };


  return (
    <div className="container">
      <h2>Search Dogs</h2>

      <label>
        Filter by Breed:
        <select
          onChange={(e) => setSelectedBreed(e.target.value)}
          value={selectedBreed}
        >
          <option value="">All Breeds</option>
          {breeds.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>

      {favorites.length > 0 && (
        <button className="match" onClick={handleMatch}>
          Generate Match
        </button>
      )}
      <br/><br/><br/>
      {matchDog && (
        <div className="match">
          <h3>🎉 Your Match! Meet Your Future Best Friend</h3>
          <DogCard dog={matchDog} isFavorite={true} onFavorite={() => {}} />
        </div>
      )}

      <br/>
      <div><h3>Unleash Love – Meet the Dogs</h3></div>

      {dogs.map((dog) => (
        <DogCard
          key={dog.id}
          dog={dog}
          isFavorite={favorites.includes(dog.id)}
          onFavorite={toggleFavorite}
        />
      ))}

      <div>
        <button className="prev" onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</button>
        <button className="next" onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
