import React, {useEffect, useState, useCallback, useMemo} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';

//TODO:"" make this more responsive

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([])
  const navigate = useNavigate();

   // Memoize the debounced fetchUsers function
   const debouncedFetchUsers = useMemo(
    () => debounce((searchQuery) => {
      fetchUsers(searchQuery);
    }, 250), // Adjust the debounce delay as needed
    []
  );

  // Ensure the debounced function is called properly when query changes
  useEffect(() => {
    if (query) {
      debouncedFetchUsers(query);
    }
    // Cancel debounced function calls on component unmount
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [query, debouncedFetchUsers]);

  const fetchUsers = async (searchQuery) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/users/test/search`, {
        params: { query: searchQuery },
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search', error);
    }
  }

  const handleUserBtn = (username) => {
    navigate(`/user/${username}`);
  }

  return ( 
    <>
      <div className="search-container">
        <input
          type = "text"
          value = {query}
          onChange={(e) => {
            setQuery(e.target.value);
          
          }}
          placeholder="Search for a user"
        />
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((user) => (
              <button
                key={user.username}
                onClick={() => handleUserBtn(user.username)}
              >
                {user.username}
              </button>
            ))}
          </div>  
        )}

      </div>
    </>
  )
}
