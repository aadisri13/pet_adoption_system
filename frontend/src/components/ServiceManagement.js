import { useState, useEffect } from 'react';
import { getServices, createService, getAdopters } from '../api';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [adopters, setAdopters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    adopter_id: '',
    service_date: new Date().toISOString().slice(0, 16),
    grooming_service: false,
    vet_service: false,
    training_service: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesResponse, adoptersResponse] = await Promise.all([
        getServices(),
        getAdopters()
      ]);
      setServices(servicesResponse.data);
      setAdopters(adoptersResponse.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingForm({
      ...bookingForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await createService(bookingForm);
      setShowBookingForm(false);
      setBookingForm({
        adopter_id: '',
        service_date: new Date().toISOString().slice(0, 16),
        grooming_service: false,
        vet_service: false,
        training_service: false
      });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create service booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Service Management</h1>
          <p className="text-gray-600">Book and manage pet services</p>
        </div>
        <button
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {showBookingForm ? 'Cancel' : 'Book Service'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Book Service Form */}
      {showBookingForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Book Service</h2>
          <form onSubmit={handleCreateService} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Adopter *
                </label>
                <select
                  name="adopter_id"
                  value={bookingForm.adopter_id}
                  onChange={handleBookingChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Adopter</option>
                  {adopters.map((adopter) => (
                    <option key={adopter.adopter_id} value={adopter.adopter_id}>
                      {adopter.fullname} ({adopter.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Service Date *
                </label>
                <input
                  type="datetime-local"
                  name="service_date"
                  value={bookingForm.service_date}
                  onChange={handleBookingChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Select Services * (at least one required)
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="grooming_service"
                    checked={bookingForm.grooming_service}
                    onChange={handleBookingChange}
                    className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Grooming Service</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="vet_service"
                    checked={bookingForm.vet_service}
                    onChange={handleBookingChange}
                    className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Veterinary Service</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="training_service"
                    checked={bookingForm.training_service}
                    onChange={handleBookingChange}
                    className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Training Service</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || (!bookingForm.grooming_service && !bookingForm.vet_service && !bookingForm.training_service)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Booking...' : 'Book Service'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBookingForm(false);
                  setBookingForm({
                    adopter_id: '',
                    service_date: new Date().toISOString().slice(0, 16),
                    grooming_service: false,
                    vet_service: false,
                    training_service: false
                  });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Bookings</h2>
        {services.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No service bookings yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.service_id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Service Booking #{service.service_id}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Date: {new Date(service.service_date).toLocaleString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {service.service_types || 'Service'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Adopter Information</h4>
                    <p className="text-gray-600">
                      <span className="font-medium">Name:</span> {service.adopter_fullname || 'N/A'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Adopter ID:</span> {service.adopter_id}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Services Requested</h4>
                    <div className="space-y-1">
                      {service.grooming_service === 1 && (
                        <p className="text-gray-600">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Grooming</span>
                        </p>
                      )}
                      {service.vet_service === 1 && (
                        <p className="text-gray-600">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">Veterinary</span>
                        </p>
                      )}
                      {service.training_service === 1 && (
                        <p className="text-gray-600">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">Training</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;

