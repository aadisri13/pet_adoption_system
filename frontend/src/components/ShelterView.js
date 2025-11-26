import { useState, useEffect } from 'react';
import { getShelters, getShelter } from '../api';
import { Link } from 'react-router-dom';

const ShelterView = () => {
  const [shelters, setShelters] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadShelters();
  }, []);

  const loadShelters = async () => {
    try {
      setLoading(true);
      const response = await getShelters();
      setShelters(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load shelters');
    } finally {
      setLoading(false);
    }
  };

  const handleShelterClick = async (shelterId) => {
    try {
      const response = await getShelter(shelterId);
      setSelectedShelter(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load shelter details');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading shelters...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Shelters</h1>
        <p className="text-gray-600">Browse shelters and available pets</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Shelters</h2>
          {shelters.length === 0 ? (
            <p className="text-gray-500">No shelters found.</p>
          ) : (
            <div className="space-y-4">
              {shelters.map((shelter) => (
                <div
                  key={shelter.shelter_id}
                  onClick={() => handleShelterClick(shelter.shelter_id)}
                  className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                    selectedShelter?.shelter_id === shelter.shelter_id
                      ? 'ring-2 ring-blue-500'
                      : ''
                  }`}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {shelter.shelter_name}
                  </h3>
                  <div className="space-y-1 text-gray-600">
                    <p>
                      <span className="font-medium">Location:</span> {shelter.city}, {shelter.state}
                    </p>
                    <p>
                      <span className="font-medium">Hours:</span> {shelter.open_hours || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Capacity:</span> {shelter.capacity}
                    </p>
                    <p className="text-blue-600 font-medium">
                      <span className="font-medium">Available Pets:</span> {shelter.available_pets_count}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedShelter && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Pets at {selectedShelter.shelter_name}</h2>
            {selectedShelter.available_pets && selectedShelter.available_pets.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">No available pets at this shelter.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {selectedShelter.available_pets?.map((pet) => (
                  <div
                    key={pet.pet_id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{pet.name}</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {pet.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-gray-600 mb-4">
                      <p><span className="font-medium">Species:</span> {pet.species}</p>
                      <p><span className="font-medium">Breed:</span> {pet.breed || 'Mixed'}</p>
                      <p><span className="font-medium">Age:</span> {pet.age_years} {pet.age_years === 1 ? 'year' : 'years'}</p>
                      <p><span className="font-medium">Gender:</span> {pet.gender}</p>
                    </div>
                    <Link
                      to={`/apply/${pet.pet_id}`}
                      className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Apply for Adoption
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShelterView;

