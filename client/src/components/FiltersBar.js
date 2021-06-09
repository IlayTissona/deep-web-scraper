import React, { useRef, useState } from "react";
import axios from "axios";
import "../styles/FiltersBar.css";

function FiltersBar({ setList, setScrollable }) {
  const [searchKey, setKey] = useState("text");
  const searchCancelToken = useRef();
  const [error, setError] = useState(null);

  const setFullList = () => {
    axios
      .get(`http://localhost:3000/all-pastes?limit=20&offset=0`)
      .then((res) => {
        setList(res.data);
        setScrollable(true);
      });
  };

  const changeHandler = (e) => {
    const searchValue = e.target.value;
    if (searchValue === "" || searchValue === " ") return setFullList();
    searchCancelToken.current && searchCancelToken.current.cancel("newSearch");
    searchCancelToken.current = axios.CancelToken.source();
    axios
      .post(
        "http://localhost:3000/search",
        { key: searchKey, searchValue },
        {
          cancelToken: searchCancelToken.current.token,
        }
      )
      .then((res) => {
        setList(res.data);
        setScrollable(true);
      })
      .catch(setError);
  };
  return (
    <div id="filters-bar">
      <div id="search-div">
        <input type="text" onChange={changeHandler} placeholder="Search ..." />
        <div id="buttons">
          <p>Search By:</p>
          <button
            className={`button${searchKey === "text" ? " picked" : ""}`}
            onClick={() => setKey("text")}
          >
            Content
          </button>
          <button
            className={`button${searchKey === "author" ? " picked" : ""}`}
            onClick={() => setKey("author")}
          >
            Author
          </button>
        </div>
      </div>
    </div>
  );
}

export default FiltersBar;
