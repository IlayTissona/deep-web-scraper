import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/FiltersBar.css";
import InfiniteScroll from "react-infinite-scroll-component";

function FiltersBar({ setList, setScrollable }) {
  const [searchKey, setKey] = useState("text");
  const searchCancelToken = useRef();

  const [entitiesState, setEntitiesState] = useState({
    entities: [],
    hasMore: true,
    offset: 0,
    chosen: null,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/entities?limit=20`)
      .then(({ data: entities }) =>
        setEntitiesState((prev) => ({ ...prev, entities }))
      );
  }, []);

  const moreEntities = () => {
    axios
      .get(
        `http://localhost:3000/entities?limit=20&offset=${entitiesState.offset}`
      )
      .then((res) => {
        if (!res.data.length)
          return setEntitiesState({ ...entitiesState, hasMore: false });

        const entities = [...entitiesState.entities, ...res.data];
        console.log(entities);
        setEntitiesState({
          ...entitiesState,
          entities,
          offset: entities.length,
        });
      });
  };

  const entityClickHandler = (entity) => {
    if (entitiesState.chosen === entity) {
      axios.get("http://localhost:3000/entities").then(({ data: entities }) => {
        setEntitiesState({ ...entitiesState, entities, chosen: null });
      });
      return setFullList();
    }
    axios.get("http://localhost:3000/entity/" + entity).then((res) => {
      console.log(res.data);
      setEntitiesState({
        ...entitiesState,
        entities: [{ entity }],
        chosen: entity,
      });
      setList(res.data);
    });
  };

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
      <div
        id="entities"
        className={`${entitiesState.chosen ? "no-scroll" : ""}`}
      >
        <InfiniteScroll
          hasMore={entitiesState.hasMore}
          dataLength={entitiesState.entities.length}
          next={moreEntities}
          scrollableTarget="entities"
          loader={
            <div className="entity last">
              <p>Loading More...</p>
            </div>
          }
          endMessage={<div></div>}
        >
          {entitiesState.entities && entitiesState.entities?.map(makeEntity)}
        </InfiniteScroll>
      </div>
    </div>
  );
  function makeEntity({ entity }) {
    return (
      <div
        className={`entity${entitiesState.chosen === entity ? " chosen" : ""}`}
        key={entity}
        onClick={() => entityClickHandler(entity)}
      >
        <p>{entity}</p>
      </div>
    );
  }
}

export default FiltersBar;
