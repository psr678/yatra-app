const rawCities = [
  // Metro cities
  'Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad',
  // Rajasthan
  'Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Pushkar', 'Ajmer', 'Mount Abu',
  // UP / North
  'Varanasi', 'Agra', 'Lucknow', 'Mathura', 'Vrindavan', 'Allahabad', 'Khajuraho', 'Orchha',
  // Punjab / Haryana
  'Amritsar', 'Chandigarh',
  // Uttarakhand
  'Rishikesh', 'Haridwar', 'Dehradun', 'Mussoorie', 'Nainital', 'Jim Corbett',
  // Himachal Pradesh
  'Shimla', 'Manali', 'Dharamshala', 'Spiti Valley', 'Kasol',
  // J&K / Ladakh
  'Leh', 'Ladakh', 'Kargil', 'Srinagar',
  // North East
  'Darjeeling', 'Gangtok', 'Pelling', 'Kalimpong', 'Guwahati', 'Kaziranga', 'Shillong', 'Cherrapunji', 'Ziro',
  // Kerala
  'Munnar', 'Kochi', 'Alleppey', 'Thiruvananthapuram', 'Kozhikode', 'Varkala',
  // Karnataka
  'Coorg', 'Mysuru', 'Hampi',
  // Tamil Nadu
  'Ooty', 'Kodaikanal', 'Madurai', 'Rameswaram', 'Kanyakumari', 'Pondicherry', 'Mahabalipuram',
  // Andaman
  'Andaman Islands', 'Port Blair', 'Havelock Island',
  // Odisha
  'Puri', 'Bhubaneswar', 'Konark',
  // Maharashtra
  'Lonavala', 'Mahabaleshwar', 'Alibaug', 'Shirdi', 'Nashik', 'Aurangabad',
  // Andhra / Telangana
  'Tirupati', 'Vizag',
  // MP
  'Pachmarhi',
  // Goa
  'Goa',
  // Region labels
  'Rajasthan', 'Kerala', 'Himachal Pradesh', 'Uttarakhand',
];

// Deduplicate while preserving order
export const indianCities = [...new Set(rawCities)];
