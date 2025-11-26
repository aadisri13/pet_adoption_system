import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPet, createApplication, getAdopters, createAdopter } from '../api';

const ApplyForm = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [adopters, setAdopters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    adopter_id: '',
    app_fee: 50.00,
    // New adopter fields
    firstname: '',
    lastname: '',
    email: '',
    dob: '',
    nationality: '',
    govt_id: '',
    city: '',
    country: '',
    zipcode: '',
  });

  const [isNewAdopter, setIsNewAdopter] = useState(false);

  useEffect(() => {
    loadData();
  }, [petId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [petResponse, adoptersResponse] = await Promise.all([
        getPet(petId),
        getAdopters(),
      ]);
      setPet(petResponse.data);
      setAdopters(adoptersResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      let adopterId = formData.adopter_id;

      // Create new adopter if needed
      if (isNewAdopter) {
        if (!formData.firstname || !formData.lastname || !formData.email) {
          throw new Error('Please fill in all required fields for new adopter');
        }
        const adopterResponse = await createAdopter({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          dob: formData.dob || null,
          nationality: formData.nationality || null,
          govt_id: formData.govt_id || null,
          city: formData.city || null,
          country: formData.country || null,
          zipcode: formData.zipcode || null,
        });
        adopterId = adopterResponse.data.adopter_id;
      }

      // Create application (this will trigger trg_adoption_before_insert)
      await createApplication({
        adopter_id: adopterId,
        pet_id: parseInt(petId),
        app_fee: parseFloat(formData.app_fee),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/pets');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">Pet not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Adoption Application</h1>
        <p className="text-gray-600">Apply to adopt {pet.name}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Pet Information</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <p><span className="font-medium">Name:</span> {pet.name}</p>
          <p><span className="font-medium">Species:</span> {pet.species}</p>
          <p><span className="font-medium">Breed:</span> {pet.breed || 'Mixed'}</p>
          <p><span className="font-medium">Age:</span> {pet.age_years} {pet.age_years === 1 ? 'year' : 'years'}</p>
          <p><span className="font-medium">Gender:</span> {pet.gender}</p>
          <p><span className="font-medium">Shelter:</span> {pet.shelter_name}</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Application submitted successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Are you a new adopter?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={!isNewAdopter}
                onChange={() => setIsNewAdopter(false)}
                className="mr-2"
              />
              Existing Adopter
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={isNewAdopter}
                onChange={() => setIsNewAdopter(true)}
                className="mr-2"
              />
              New Adopter
            </label>
          </div>
        </div>

        {!isNewAdopter ? (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Select Adopter *
            </label>
            <select
              name="adopter_id"
              value={formData.adopter_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select an adopter</option>
              {adopters.map((adopter) => (
                <option key={adopter.adopter_id} value={adopter.adopter_id}>
                  {adopter.fullname} ({adopter.email})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Government ID
              </label>
              <input
                type="text"
                name="govt_id"
                value={formData.govt_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Zipcode
                </label>
                <input
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Application Fee ($)
          </label>
          <input
            type="number"
            name="app_fee"
            value={formData.app_fee}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/pets')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyForm;

