// Utility function to format dates
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // Format as MM/DD/YYYY
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Alternative format function for more readable dates
export const formatDateLong = (dateString) => {
  const date = new Date(dateString);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
