import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import getUser from '../utils/getUser';
import LoadingSpinner from '../component/LoadingSpinner';
import ErrorMessage from '../component/ErrorMessage';
import fetchData from '../utils/fetchData';

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lastPayment, setLastPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [date, setDate] = useState(new Date());
    
  useEffect(()=>{
    const path = "/api/v1/payment/get-last-payment";
    const redirectLink = "/payment/success";
    fetchData(path, redirectLink, setLastPayment, setIsLoading, setError, navigate);
    getUser(setUser);
    
  }, []);

  useEffect(()=>{
    setDate(prev => new Date(lastPayment?.createdAt || null));
  }, [lastPayment])

  if(isLoading){
    return(
      <LoadingSpinner/>
    );
  }

  if(error){
    return(
      <ErrorMessage message={error}/>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 text-center mb-6">
              Thank you for your purchase. Your transaction has been completed successfully.
            </p>
            
            <div className="w-full bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-medium break-all">{lastPayment?.trnx_id || "111 666 999"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">{date?.toLocaleDateString() || "5/7/2025"}</span>
              </div>
            </div>
            
            <div className="w-full">
              <Link to="/student/dashboard" className="block w-full">
                <div className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-center">
                  Go back to dashboard
                </div>
              </Link>
            </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;