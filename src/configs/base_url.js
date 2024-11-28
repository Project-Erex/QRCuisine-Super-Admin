const baseUrls = {
  USA: "https://qrcuisine-usa.vercel.app",
  India: "https://www.qrcuisine.com",
};

export const getBaseUrl = () => {
  // Get the selected version from local storage
  const selectedVersion = localStorage.getItem("selectedVersion");

  return baseUrls[selectedVersion]; // Adjust fallback as needed
};
