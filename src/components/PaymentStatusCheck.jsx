import React, { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { FaCheckCircle, FaClock, FaExclamationTriangle, FaRefresh } from 'react-icons/fa';

const PaymentStatusCheck = () => {
  const [pendingPayment, setPendingPayment] = useState(null);
  const [checking, setChecking] = useState(false);
  const [user, setUser] = useState(null);
  const token = getCookie('token');
  const id = getCookie('id');

  useEffect(() => {
    // Check for pending payment in localStorage
    const stored = localStorage.getItem('pending_payment');
    if (stored) {
      try {
        setPendingPayment(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing pending payment:', e);
        localStorage.removeItem('pending_payment');
      }
    }

    // Fetch current user data
    if (token && id) {
      fetchUserData();
    }
  }, [token, id]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`https://arfed-api.onrender.com/api/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      });
      setUser(response.data[0] || response.data || null);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const checkPaymentStatus = async () => {
    if (!pendingPayment) return;
    
    setChecking(true);
    try {
      // Check if user now has premium access
      await fetchUserData();
      
      // If user has a valid plan, remove pending payment
      const validPaidPlans = ["daily", "weekly", "monthly", "termly", "yearly", "premium"];
      if (user && validPaidPlans.includes(user.plan)) {
        localStorage.removeItem('pending_payment');
        setPendingPayment(null);
        toast({
          title: "Payment Verified!",
          description: "Your premium access is now active.",
          variant: "default"
        });
      } else {
        toast({
          title: "Payment Still Pending",
          description: "Your payment is being processed. Please wait or contact support.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast({
        title: "Error",
        description: "Failed to check payment status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setChecking(false);
    }
  };

  const contactSupport = () => {
    const message = `Hi, I made a payment but haven't received premium access yet. Here are my details:
    
Transaction ID: ${pendingPayment?.transaction_id}
Plan: ${pendingPayment?.plan}
Payment Date: ${pendingPayment?.timestamp}
User ID: ${id}

Please help me get access to premium features.`;

    // Copy to clipboard
    navigator.clipboard.writeText(message);
    toast({
      title: "Support Message Copied",
      description: "Payment details copied to clipboard. Please paste this in your support request.",
      variant: "default"
    });
  };

  const clearPendingPayment = () => {
    localStorage.removeItem('pending_payment');
    setPendingPayment(null);
    toast({
      title: "Payment Info Cleared",
      description: "Pending payment information has been cleared.",
      variant: "default"
    });
  };

  if (!pendingPayment) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-orange-200 p-4 max-w-sm z-50">
      <div className="flex items-start space-x-3">
        <FaClock className="text-orange-500 mt-1 flex-shrink-0" size={20} />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">Payment Pending Verification</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Plan:</strong> {pendingPayment.plan}</p>
            <p><strong>Transaction ID:</strong> {pendingPayment.transaction_id}</p>
            <p><strong>Date:</strong> {new Date(pendingPayment.timestamp).toLocaleString()}</p>
          </div>
          
          <div className="mt-3 space-y-2">
            <button
              onClick={checkPaymentStatus}
              disabled={checking}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {checking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <FaRefresh size={14} />
                  <span>Check Status</span>
                </>
              )}
            </button>
            
            <button
              onClick={contactSupport}
              className="w-full bg-orange-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-orange-700"
            >
              Contact Support
            </button>
            
            <button
              onClick={clearPendingPayment}
              className="w-full bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-400"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusCheck; 