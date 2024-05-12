import  { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";


function App() {
  const [state, setState] = useState([]);
  const [query, setQuery] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [url,setUrl] = useState('')
  const [searched,setSearched] = useState(true)

  const API_KEY = import.meta.env.VITE_API_KEY;
  const SEARCH_ENGINE_ID = import.meta.env.VITE_SEARCH_ID;

  const cache = useRef(new Map());

  const CustomSearch = useCallback(async () => {
    try {
      const cacheKey = query;
      const cacheData = cache.current.get(cacheKey);
      if (cacheData) {
        setUrl('')
        setState(cacheData);
        setSearched(true)
      } else {
        setIsPending(true);
        const res = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${query}&searchType=image`
        );
        setUrl('')
        setSearched(true)


        const data = await res.json();
        const imageLinks = data.items.map((item) => item.link);
        setState(imageLinks);
        cache.current.set(cacheKey, imageLinks);
      }
    } catch (err) {
      console.log(err);
      toast.error('Check youre internet connection')
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
      toast.error('Sorry, the requested image cannot be downloaded due to legal restrictions.')
    }
  };
  
// const color = bg-[#0E1419]
  return (
    <div className=" relative w-full flex flex-col justify-start items-center min-h-screen ">
      <img src="https://www.wallpaperbetter.com/wallpaper/290/568/943/abstracts-dark-future-1080P-wallpaper.jpg" alt="" className="absolute top-0 left-0 w-full h-full object-cover z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
      {/* Search card */}

      <div className="w-1/3 bg-[#0E1419] h-48 flex flex-col items-center justify-center rounded-lg mt-5  z-10 ">
        <span className="text-lg font-bold text-white">Search and download images!</span>

      <div className="w-full  bg-[#0E1419] h-20 flex justify-center items-center rounded-lg  space-x-3 z-10 pl-2 pr-2">
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-10 w-full bg-gray-700 text-white rounded-md pl-2"
        placeholder="eg:- 4k wallpaper..."
      />
      <button
        onClick={CustomSearch}
        className="w-24 h-10 bg-blue-500 rounded-md text-white font-semibold"
      >
        Search
      </button>
    </div>
      </div>

     

{
  searched && (
    <span className="text-lg font-bold text-white z-0 mt-10">Click to download!</span>
  )
}

      {/* Large view*/}
      {
        url && (
          <div className="flex flex-col h-96 z-0 mt-8 rounded-xl">
            <img src={url} className="w-full h-full object-contain rounded-tl-xl rounded-tr-xl  border-t-2 border-l-2 border-r-2" />
            <button className="w-full bg-green-500  text-white font-semibold " onClick={saveImage}>Save</button>
          </div>
        )
      }

      {/* Display slider */}
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full p-10 h-auto ">
          <div className="w-full flex items-center justify-center flex-wrap space-x-4 space-y-2 overflow-y-auto  ">
            {state.map((item, index) => (
              <div
              className='w-60 h-60 rounded-xl flex-shrink-0 p-3 shadow-xl'
              key={index}
              style={{ filter: "brightness(1.2) contrast(1.2)" }}
              onClick={() => setUrl(item)}
              
            >

              <img
                className="object-cover w-full h-full rounded-xl border-2 hover:transform hover:scale-110 transition-all duration-300"
                src={item}
                alt={'Not found'}
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
