
import React from 'react';
import Header from '@/components/Header';
import ConsultationBookingForm from '@/components/ConsultationBookingForm';

const ConsultationBooking = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Book Your Video Consultation
          </h1>
          <p className="text-gray-600">
            Fill out the form below to request a consultation with our medical experts
          </p>
        </div>
        <ConsultationBookingForm />
      </div>
    </div>
  );
};

export default ConsultationBooking;
