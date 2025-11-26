import { useState, useEffect } from 'react';
import { getPendingApplications, getApprovedApplications, approveAdoption, rejectAdoption } from '../api';

const AdminDashboard = () => {
  const [pendingApplications, setPendingApplications] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const [pendingResponse, approvedResponse] = await Promise.all([
        getPendingApplications(),
        getApprovedApplications()
      ]);
      setPendingApplications(pendingResponse.data);
      setApprovedApplications(approvedResponse.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (app_no) => {
    try {
      setProcessing({ ...processing, [app_no]: true });
      await approveAdoption(app_no);
      // Reload applications to see updated status (moved from pending to approved)
      await loadApplications();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve application');
    } finally {
      setProcessing({ ...processing, [app_no]: false });
    }
  };

  const handleReject = async (app_no) => {
    try {
      if (!window.confirm('Are you sure you want to reject this application?')) {
        return;
      }
      setProcessing({ ...processing, [`reject_${app_no}`]: true });
      await rejectAdoption(app_no);
      // Reload applications to remove rejected application from pending list
      await loadApplications();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject application');
    } finally {
      setProcessing({ ...processing, [`reject_${app_no}`]: false });
    }
  };

  const ApplicationCard = ({ app, showApproveButton = false }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800">
            Application #{app.app_no}
          </h3>
          <p className="text-gray-600 mt-1">
            Submitted: {new Date(app.app_date).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          app.status === 'approved' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {app.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Adopter Information</h4>
          <p className="text-gray-600">
            <span className="font-medium">Name:</span> {app.adopter_fullname}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Adopter ID:</span> {app.adopter_id}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Pet Information</h4>
          <p className="text-gray-600">
            <span className="font-medium">Name:</span> {app.pet_name}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Species:</span> {app.species}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Breed:</span> {app.breed || 'Mixed'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Pet ID:</span> {app.pet_id}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-gray-700">
          <span className="font-medium">Application Fee:</span> ${parseFloat(app.app_fee).toFixed(2)}
        </p>
        {app.shelter_name && (
          <p className="text-gray-700 mt-1">
            <span className="font-medium">Shelter:</span> {app.shelter_name}
          </p>
        )}
      </div>

      {showApproveButton && (
        <div className="flex gap-3">
          <button
            onClick={() => handleApprove(app.app_no)}
            disabled={processing[app.app_no]}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {processing[app.app_no] ? 'Processing...' : 'Approve'}
          </button>
          <button
            onClick={() => handleReject(app.app_no)}
            disabled={processing[`reject_${app.app_no}`]}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {processing[`reject_${app.app_no}`] ? 'Processing...' : 'Reject'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Review and approve adoption applications</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-64">
          <div className="text-xl">Loading applications...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Applications Column */}
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Pending Applications
              </h2>
              <p className="text-gray-600 text-sm">
                {pendingApplications.length} {pendingApplications.length === 1 ? 'application' : 'applications'} awaiting review
              </p>
            </div>

            {pendingApplications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500 text-lg">No pending applications at this time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingApplications.map((app) => (
                  <ApplicationCard key={app.app_no} app={app} showApproveButton={true} />
                ))}
              </div>
            )}
          </div>

          {/* Approved Applications Column */}
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Approved Applications
              </h2>
              <p className="text-gray-600 text-sm">
                {approvedApplications.length} {approvedApplications.length === 1 ? 'application' : 'applications'} approved
              </p>
            </div>

            {approvedApplications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500 text-lg">No approved applications yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedApplications.map((app) => (
                  <ApplicationCard key={app.app_no} app={app} showApproveButton={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

