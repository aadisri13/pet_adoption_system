import { useState, useEffect } from 'react';
import { getPets } from '../api';
import { Link } from 'react-router-dom';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // all, available, pending, adopted

  useEffect(() => {
    loadPets();
  }, []);

  useEffect(() => {
    filterPets();
  }, [pets, statusFilter]);

  const loadPets = async () => {
    try {
      setLoading(true);
      const response = await getPets();
      const allPets = response.data;
      setPets(allPets);
      // Initialize filtered pets based on current filter
      if (statusFilter === 'all') {
        setFilteredPets(allPets);
      } else if (statusFilter === 'pending') {
        // Show pets that have status 'pending' OR have pending applications
        setFilteredPets(allPets.filter(pet => 
          (pet.status && pet.status.toLowerCase() === 'pending') || 
          (pet.pending_applications_count > 0)
        ));
      } else {
        setFilteredPets(allPets.filter(pet => pet.status && pet.status.toLowerCase() === statusFilter.toLowerCase()));
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  const filterPets = () => {
    if (statusFilter === 'all') {
      setFilteredPets(pets);
    } else if (statusFilter === 'pending') {
      // Show pets that have status 'pending' OR have pending applications
      setFilteredPets(pets.filter(pet => 
        (pet.status && pet.status.toLowerCase() === 'pending') || 
        (pet.pending_applications_count > 0)
      ));
    } else {
      setFilteredPets(pets.filter(pet => pet.status && pet.status.toLowerCase() === statusFilter.toLowerCase()));
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'adopted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Get display status - if pet has pending applications, show as pending
  const getDisplayStatus = (pet) => {
    if (pet.pending_applications_count > 0 && pet.status === 'available') {
      return 'pending';
    }
    return pet.status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading pets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">All Pets</h1>
        <p className="text-gray-600">Browse all pets and their adoption status</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Pets ({pets.length})
        </button>
        <button
          onClick={() => setStatusFilter('available')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'available'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Available ({pets.filter(p => p.status === 'available').length})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending ({pets.filter(p => p.status === 'pending' || p.pending_applications_count > 0).length})
        </button>
        <button
          onClick={() => setStatusFilter('adopted')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'adopted'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Adopted ({pets.filter(p => p.status === 'adopted').length})
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Debug info - remove this later */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 text-xs text-gray-500">
          Debug: Total pets: {pets.length} | Filtered: {filteredPets.length} | Filter: {statusFilter} | 
          Available: {pets.filter(p => p.status === 'available').length} | 
          Pending: {pets.filter(p => p.status === 'pending' || p.pending_applications_count > 0).length} | 
          Adopted: {pets.filter(p => p.status === 'adopted').length}
        </div>
      )}

      {filteredPets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {statusFilter === 'all' 
              ? `No pets found. (Total in database: ${pets.length})` 
              : `No ${statusFilter} pets at the moment.`}
          </p>
          {pets.length > 0 && statusFilter !== 'all' && (
            <p className="text-gray-400 text-sm mt-2">
              Try clicking "All Pets" to see all {pets.length} pets
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <div
              key={pet.pet_id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-semibold text-gray-800">{pet.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(getDisplayStatus(pet))}`}>
                    {getDisplayStatus(pet)}
                  </span>
                </div>
                
                <div className="space-y-2 text-gray-600 mb-4">
                  <p><span className="font-medium">Species:</span> {pet.species}</p>
                  <p><span className="font-medium">Breed:</span> {pet.breed || 'Mixed'}</p>
                  <p><span className="font-medium">Age:</span> {pet.age_years} {pet.age_years === 1 ? 'year' : 'years'} old</p>
                  <p><span className="font-medium">Gender:</span> {pet.gender}</p>
                  <p><span className="font-medium">Shelter:</span> {pet.shelter_name || 'N/A'}</p>
                  <p><span className="font-medium">Location:</span> {pet.shelter_city || 'N/A'}</p>
                  
                  {/* Show pending applications count - only if status is still available (not already showing as pending) */}
                  {pet.pending_applications_count > 0 && pet.status === 'available' && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-yellow-600 font-medium">
                        ⚠️ {pet.pending_applications_count} {pet.pending_applications_count === 1 ? 'application' : 'applications'} pending
                      </p>
                    </div>
                  )}
                </div>

                {/* Show Apply button for available and pending pets */}
                {(getDisplayStatus(pet) === 'available' || getDisplayStatus(pet) === 'pending') && pet.status !== 'adopted' ? (
                  <Link
                    to={`/apply/${pet.pet_id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Apply for Adoption
                  </Link>
                ) : (
                  <div className="w-full text-center bg-gray-100 text-gray-600 py-2 px-4 rounded-lg font-medium">
                    Already Adopted
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetList;

