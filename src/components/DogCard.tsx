import React from "react";
import type { DogWithLocation } from "../types";

interface Props {
  dog: DogWithLocation;
  isFavorite: boolean;
  onFavorite: (id: string) => void;
}

const DogCard: React.FC<Props> = ({ dog, isFavorite, onFavorite }) => {
  return (
    <div className="dog-card">
      <img src={dog.img} alt={dog.name} className="dog-img" />
      <div className="dog-info">
        <h4>{dog.name}</h4>
        <p><strong>Breed:</strong> {dog.breed}</p>
        <p><strong>Age:</strong> {dog.age}</p>
        <p><strong>Zip Code:</strong> {dog.zip_code}</p>
        {dog.city && dog.state &&(
          <p>
            <strong>Location:</strong> {dog.city}, {dog.state}
          </p>
        )}
      </div>
      <button className="favorite-btn" onClick={() => onFavorite(dog.id)}>
        {isFavorite ? "★" : "☆"}
      </button>
    </div>
  );
};

export default DogCard;


