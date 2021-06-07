import React, { useCallback, useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import "../styles/PastesTable.css";
import OpenPaste from "./OpenPaste";

const PAGE_SIZE = 25;

function PastesTable() {
  const [state, setState] = useState({
    loading: true,
    pastes: [],
    openPaste: null,
    offset: PAGE_SIZE,
    offsetLoading: false,
  });

  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/all-pastes?limit=${PAGE_SIZE}&offset=0`)
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          pastes: res.data,
        }));
      })
      .catch((e) => setState({ error: e }));
  }, []);

  const morePastes = (e) => {
    axios
      .get("http://localhost:3000/all-pastes?limit=25&offset=" + state.offset)
      .then((res) => {
        if (!res.data.length) setHasMore(false);
        setState({
          ...state,
          pastes: [...state.pastes, ...res.data],
          offset: state.offset + res.data.length,
        });
      });
  };

  return state.loading ? (
    <Loader />
  ) : (
    <div id="main-table">
      <div id="thead">
        <div className="row">
          <div>Date</div>
          <div>Author</div>
          <div>Title</div>
          <div>Content</div>
          <div>Views</div>
        </div>
      </div>
      <div id="table-body">
        <InfiniteScroll
          hasMore={hasMore}
          dataLength={state.pastes.length}
          next={morePastes}
          scrollableTarget="table-body"
          loader={
            <div className="last-row">
              <p>Loading More...</p>
            </div>
          }
          endMessage={
            <div className="last-row">
              <p>No More Pastes.</p>
            </div>
          }
        >
          {state.pastes && state.pastes?.map(makeRow)}
        </InfiniteScroll>
      </div>
      {state.openPaste ? (
        <OpenPaste
          paste={state.openPaste}
          close={() => setState({ ...state, openPaste: null })}
        />
      ) : null}
    </div>
  );

  function makeRow(post) {
    return (
      <div
        className="row"
        key={post.id}
        onClick={() => setState({ ...state, openPaste: post })}
      >
        <div className="post-date">{new Date(post.date).toDateString()}</div>
        <div className="post-author">{post.author}</div>
        <div className="post-title">{post.title}</div>
        <div className="post-content">{post.text}</div>
        <div className="post-views">{post.views}</div>
      </div>
    );
  }
}
export default PastesTable;
