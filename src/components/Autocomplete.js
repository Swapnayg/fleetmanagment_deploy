// Autocomplete.js
import React, { useState, useEffect, useRef } from 'react';
const inputRef = React.createRef();

const Autocomplete = ({ suggestions }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const autocompleteRef = useRef(null);

  const handleChange = (event) => {
    setIsOpen(true);
    const inputValue = event.target.value;
    setInputValue(inputValue);

    // Filter suggestions based on input value
    const filteredSuggestions = suggestions.filter(suggestion =>
      suggestion.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredSuggestions(filteredSuggestions);
  };

  const handleSelect = (value) => {
    setInputValue(value.label);
    var sele_Val = value.value.toString().trim().split("_Type_");
    var sel_sub_type = sele_Val[1].toString().trim().split("_SubType_");
    if(sel_sub_type[0] == "supplier")
    {
        window.location.href = '/manage-supplier';
    }
    else if(sel_sub_type[0] == "client")
    {
        window.location.href = '/manage-customer';
    }
    else if(sel_sub_type[0] == "party")
    {
        if(sel_sub_type[1] == "goods")
        {
            window.location.href = '/goods-parties';
        }  
        else if(sel_sub_type[1] == "oil")
        {
            window.location.href = '/oil-parties';
        }  
    }
    else if(sel_sub_type[0] == "vehicle")
    {
        if(sel_sub_type[1] == "goods")
        {
            window.location.href = '/oil-parties';
        }  
        else if(sel_sub_type[1] == "oil")
        {
            window.location.href = '/oil-vehicles';
        }  
    }
    else if(sel_sub_type[0] == "invoice")
    {
        window.location.href = '/manage-invoice';
    }
    else if(sel_sub_type[0] == "clnreturn")
    {
        window.location.href = '/manage-stock';
    }
    else if(sel_sub_type[0] == "return")
    {
        window.location.href = '/manage-stock';
    }
    else if(sel_sub_type[0] == "order")
    {
        window.location.href = '/manage-order';
    }
    else if(sel_sub_type[0] == "goods")
    {
        window.location.href = '/add-manifest';
    }
    else if(sel_sub_type[0]== "oil")
    {
        window.location.href = '/add-oil-manifest';
    }
    setFilteredSuggestions([]);
  };

const handleOuterClick = e => {
    if (!inputRef.current.contains(e.target)) {
      setIsOpen(false);
    }
};
  const onKeyDown = e => {
    if (e.keyCode === 13) {
      // 1. enter key
      setShowSuggestions(false);
    }
  };



  useEffect(() => {
    document.addEventListener("click", handleOuterClick);
  }, []);


  return (
    <div className="autocomplete-container" ref={inputRef}>
      <input
        className="autocomplete-input"
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Type to search..."
        onKeyDown={onKeyDown}
      />
        <ul className="autocomplete-suggestions">
            {filteredSuggestions.map((suggestion, index) => (
            <li key={suggestion.value} className="autocomplete-suggestion" onClick={() => handleSelect(suggestion)}>
                {suggestion.label}
            </li>
            ))}
        </ul>
    </div>
  );
};

export default Autocomplete;