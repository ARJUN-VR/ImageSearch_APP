import  { useCallback, useEffect, useRef, useState } from "react";


function App() {
  const [state, setState] = useState([]);
  const [query, setQuery] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [url,setUrl] = useState('')

  const API_KEY = import.meta.env.VITE_API_KEY;
  const SEARCH_ENGINE_ID = import.meta.env.VITE_SEARCH_ID;

  const cache = useRef(new Map());

  useEffect(() => {
    // Empty dependency array indicates that this effect runs only once after initial render
  }, []);

  const CustomSearch = useCallback(async () => {
    try {
      const cacheKey = query;
      const cacheData = cache.current.get(cacheKey);
      if (cacheData) {
        setUrl('')
        setState(cacheData);
      } else {
        setIsPending(true);
        const res = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${query}&searchType=image`
        );
        setUrl('')

        const data = await res.json();
        const imageLinks = data.items.map((item) => item.link);
        setState(imageLinks);
        cache.current.set(cacheKey, imageLinks);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsPending(false);
    }
  }, [query, API_KEY, SEARCH_ENGINE_ID]);

  const saveImage = async () => {
    try {
      const response = await fetch(url); 
      const blob = await response.blob(); 
      const blobUrl = URL.createObjectURL(blob); 

  
      const link = document.createElement('a');
      link.href = blobUrl; 
      link.download = 'image.png';
      link.click();
  
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="bg-[#0E1419] w-full flex flex-col justify-start items-center">
      {/* Search card */}
      <div className="w-1/3 sm:w-1/3 bg-gray-800 h-48 flex justify-center items-center rounded-lg mt-10 space-x-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 w-3/4 bg-gray-700 text-white rounded-md pl-1"
        />
        <button
          onClick={CustomSearch}
          className="w-24 h-10 bg-blue-500 rounded-md"
        >
          Fetch
        </button>
      </div>

      {/* Large view*/}
      {
        url && (
          <div className="flex flex-col w-1/3 sm:w-1/3 h-96 mt-10">
            <img src={url} className="w-full h-full object-contain" />
            <button className="w-full bg-green-700 text-white " onClick={saveImage}>Save</button>
          </div>
        )
      }

      {/* Display slider */}
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full p-10 h-auto  mt-10">
          <div className="w-full flex items-center justify-center flex-wrap space-x-4 space-y-2">
            {state.map((item, index) => (
              <div
              className="w-60 h-60 rounded-xl bg-gray-700 flex-shrink-0 p-3 shadow-xl"
              key={index}
              style={{ filter: "brightness(0.8) contrast(1.2)" }}
              onClick={() => setUrl(item)}
            >
              <img
                className="object-cover w-full h-full rounded-xl"
                src={item}
                alt={`Image ${index}`}
              />
            </div>
            
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
