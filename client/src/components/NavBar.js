import React, { useState, useEffect } from "react";

export default function NavBar() {
  const [query, setQuery] = useState('');
    return (
      <div className="Navigation">
      <div className='Search'>
        <label>
          <input 
            type="text" 
            value={query}
            placeholder="Search"
            onChange={(e) => {
                setQuery(e.target.value);
            }}
        />
        </label>
      </div>
      <button>Home</button>
      <button>UserPage</button>
      </div>
    )
}