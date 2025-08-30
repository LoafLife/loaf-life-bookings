import React, { useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';
const LoafLifeReservationSystem = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedPass, setSelectedPass] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [reservationsByDate, setReservationsByDate] = useState({});
  const [bookingComplete, setBookingComplete] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  // Pass options
  const passOptions = [
    {
      id: 'first-tracks',
      name: 'First Tracks',
      price: 15,
      description: 'Day Pass - Full day access to coworking space',
      duration: '1 day',
      type: 'day'
    },
    {
      id: 'the-gate',
      name: 'The Gate',
      price: 50,
      description: 'Day Rate for Private Office',
      duration: '1 day',
      type: 'private-day'
    },
    {
      id: 'base-lodge',
      name: 'Base Lodge',
      price: 60,
      description: '1 Week Membership - Unlimited access for 7 consecutive days',
      duration: '7 days',
      type: 'week'
    },
    {
      id: 'mountain-local',
      name: 'Mountain Local',
      price: 175,
      description: '1 Month Membership - Unlimited access for 30 days',
      duration: '30 days',
      type: 'monthly'
    },
    {
      id: 'gondola-month',
      name: 'The Gondola',
      price: 350,
      description: 'Private Reserved Workstation - Monthly membership',
      duration: '30 days',
      type: 'reserved-monthly'
    },
    {
      id: 'gondola-commitment',
      name: 'The Gondola',
      price: 250,
      description: 'Private Reserved Workstation - 6 to 12 month commitment',
      duration: '6-12 months',
      type: 'reserved-commitment'
    },
    {
      id: 'private-office',
      name: 'Private',
      price: 450,
      description: 'Private Office - Full month access to dedicated private office',
      duration: '30 days',
      type: 'private-monthly'
    }
  ];

  // Inventory structure
  const spaceInventory = {
    'first-tracks': { 
      name: 'Flex Space Access', 
      dailyCapacity: 12, 
      description: 'Access to flex desks and shared workspace areas',
      spaces: ['Tufts Run', 'Carrabassett Way', 'Bigelow Glades', 'Flagstaff Bowl', 'Cathedral Drop', 'Poplar Cruiser']
    },
    'the-gate': { 
      name: 'The Gate Private Office', 
      dailyCapacity: 1, 
      description: 'Day access to The Gate private office with lockable door',
      spaces: ['The Gate']
    },
    'gondola-month': { 
      name: 'Gondola Workstations', 
      dailyCapacity: 4, 
      description: 'Access to reserved Gondola workstations with storage',
      spaces: ['Gondola 1', 'Gondola 2', 'Gondola 3', 'Gondola 4']
    },
    'gondola-commitment': { 
      name: 'Gondola Workstations', 
      dailyCapacity: 4, 
      description: 'Reserved Gondola workstations (6-12 month commitment)',
      spaces: ['Gondola 1', 'Gondola 2', 'Gondola 3', 'Gondola 4']
    },
    'base-lodge': { 
      name: 'Flex Space Access', 
      dailyCapacity: 12, 
      description: 'Weekly access to flex desks and shared spaces',
      spaces: ['Tufts Run', 'Carrabassett Way', 'Bigelow Glades', 'Flagstaff Bowl', 'Cathedral Drop', 'Poplar Cruiser']
    },
    'mountain-local': { 
      name: 'Flex Space Access', 
      dailyCapacity: 12, 
      description: 'Monthly access to flex desks and shared spaces',
      spaces: ['Tufts Run', 'Carrabassett Way', 'Bigelow Glades', 'Flagstaff Bowl', 'Cathedral Drop', 'Poplar Cruiser']
    },
    'private-office': { 
      name: 'Ira Mountain Private Office', 
      dailyCapacity: 1, 
      description: 'Full month access to Ira Mountain dedicated private office',
      spaces: ['Ira Mountain']
    }
  };

  const getRemainingCapacity = (passType, dateString) => {
    const capacity = spaceInventory[passType]?.dailyCapacity || 0;
    const dateReservations = reservationsByDate[dateString] || {};
    const currentReservations = dateReservations[passType] || 0;
    return Math.max(0, capacity - currentReservations);
  };

  const isPassAvailableInPeriod = (passType) => {
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const remainingCapacity = getRemainingCapacity(passType, dateString);
      if (remainingCapacity > 0) {
        return true;
      }
    }
    return false;
  };

  const availablePasses = passOptions.filter(pass => isPassAvailableInPeriod(pass.id));

  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const calendarDates = generateCalendarDates();

  const toggleDateSelection = (date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDates(prev => {
      if (prev.includes(dateString)) {
        return prev.filter(d => d !== dateString);
      } else {
        return [...prev, dateString].sort();
      }
    });
  };

  const processPayment = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, paymentId: 'pi_' + Math.random().toString(36).substr(2, 9) });
      }, 2000);
    });
  };

  const sendAccessCode = async (phone) => {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    setAccessCode(code);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, code });
      }, 1000);
    });
  };

  const completeBooking = async () => {
    try {
      const payment = await processPayment();
      if (!payment.success) throw new Error('Payment failed');

      const newReservations = { ...reservationsByDate };
      selectedDates.forEach(date => {
        if (!newReservations[date]) newReservations[date] = {};
        const currentCount = newReservations[date][selectedPass.id] || 0;
        newReservations[date][selectedPass.id] = currentCount + 1;
      });
      setReservationsByDate(newReservations);

      await sendAccessCode(customerInfo.phone);
      setBookingComplete(true);
    } catch (error) {
      alert('Booking failed: ' + error.message);
    }
  };

  const calculateTotal = () => {
    if (!selectedPass || selectedDates.length === 0) return 0;
    
    if (selectedPass.type === 'day' || selectedPass.type === 'private-day') {
      return selectedPass.price * selectedDates.length;
    }
    return selectedPass.price;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (bookingComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your desk reservation has been successfully processed.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Booking Details:</h3>
            <p><strong>Pass:</strong> {selectedPass.name}</p>
            <p><strong>Space:</strong> {spaceInventory[selectedPass.id]?.name}</p>
            <p><strong>Dates:</strong> {selectedDates.map(formatDate).join(', ')}</p>
            <p><strong>Total Paid:</strong> ${calculateTotal()}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Your Access Code</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">{accessCode}</p>
            <p className="text-sm text-gray-600">A text message has been sent to {customerInfo.phone}</p>
          </div>

          <button
            onClick={() => {
              setCurrentStep(1);
              setSelectedDates([]);
              setSelectedPass(null);
              setBookingComplete(false);
              setCustomerInfo({ name: '', email: '', phone: '' });
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Make Another Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reserve Your Desk at Loaf Life</h1>
        <p className="text-gray-600">Lifting Our Area's Future - Professional coworking in the heart of Kingfield</p>
      </div>

      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 5 && <div className={`w-12 h-1 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Choose Your Pass</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePasses.map((pass) => (
              <div
                key={pass.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPass?.id === pass.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPass(pass)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{pass.name}</h3>
                  {pass.type === 'reserved-commitment' && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Best Value!</span>
                  )}
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-2">${pass.price}</p>
                <p className="text-sm text-gray-600 mb-2">{pass.description}</p>
                <p className="text-xs text-gray-500">{pass.duration}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setCurrentStep(2)}
            disabled={!selectedPass}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Continue to Date Selection
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Select Your Dates</h2>
            <p className="text-sm text-gray-600">
              {selectedPass?.name} - ${selectedPass?.price}
            </p>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-gray-700 py-2">{day}</div>
            ))}
            {calendarDates.map((date) => {
              const dateString = date.toISOString().split('T')[0];
              const isSelected = selectedDates.includes(dateString);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <button
                  key={dateString}
                  onClick={() => toggleDateSelection(date)}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600'
                      : isToday
                      ? 'border-blue-300 bg-blue-50 hover:bg-blue-100'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {selectedDates.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium">Selected dates:</p>
              <p className="text-sm text-gray-600">{selectedDates.map(formatDate).join(', ')}</p>
              <p className="font-semibold mt-2">Total: ${calculateTotal()}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={selectedDates.length === 0}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({...prev, name: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({...prev, email: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({...prev, phone: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number for access code"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Complete Booking
            </button>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Complete Your Reservation</h2>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Booking Summary:</h3>
            <p><strong>Pass:</strong> {selectedPass.name}</p>
            <p><strong>Dates:</strong> {selectedDates.map(formatDate).join(', ')}</p>
            <p className="text-xl font-bold mt-2 text-blue-600">Total: ${calculateTotal()}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={completeBooking}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Complete Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoafLifeReservationSystem;
