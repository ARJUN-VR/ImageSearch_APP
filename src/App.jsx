import { useCallback, useEffect, useRef, useState } from 'react';


function App() {
  const [state, setState] = useState([]);
  const [query, setQuery] = useState("");
  const [isPending, setIsPending] = useState(false);


  const API_KEY = import.meta.env.VITE_API_KEY;
  const SEARCH_ENGINE_ID = import.meta.env.VITE_SEARCH_ID;

  const cache = useRef(new Map());

  useEffect(() => {

    
  }, [state]);

  const CustomSearch = useCallback( async () => {
    try {
      const cacheKey = query;
      const cacheData = cache.current.get(cacheKey)
      if(cacheData){
        setState(cacheData)
      }else{
        console.log('function called')
      setIsPending(true);
      const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${query}&searchType=image`);
      const data = await res.json();
      const imageLinks = data.items.map((item) => item.link);
      setState(imageLinks);
      cache.current.set(cacheKey,imageLinks)
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsPending(false);
    }
  },[query,API_KEY,SEARCH_ENGINE_ID]);


  return (
    <div className='bg-gray-800 w-full h-[734px] flex flex-col justify-center items-center'>
      {/* search card */}
      <div className='w-2/3 bg-gray-400 h-20 flex justify-between'>
        <button onClick={CustomSearch} className='w-full h-full'>Fetch</button>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} className='w-2/3' />
      </div>

      {isPending ? (
        <div>Loading...</div>
      ) : (
        <>
        {/* content */}
          <div className='flex flex-wrap justify-center mt-20 w-full space-x-5 space-y-4'>
            {state.map((item, index) => (
              <div className='max-w-60 max-h-60 rounded-xl bg-gray-400' key={index}>
                <img className='object-cover w-full h-full rounded-xl' src={item} alt={`Image ${index}`} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
