const CACHE_KEY = "geeta_offline_dataset_v1";

export async function initializeGitaCache() {
  try {
    // Check if already cached
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      console.log("Gita dataset already loaded in local cache.");
      return JSON.parse(cached);
    }

    // Otherwise, fetch it from the public/src assets
    const response = await fetch("/src/data/gita.json"); // Adjust path if served from public
    if (!response.ok) throw new Error("Failed to fetch gita.json");
    
    const data = await response.json();
    
    // Store in localStorage (or we can use IndexedDB if preferred)
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    console.log("Gita dataset successfully cached for offline use!");
    return data;
  } catch (error) {
    console.error("Error initializing offline cache:", error);
    return null;
  }
}

export function getOfflineGitaData() {
  const cached = localStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : null;
}