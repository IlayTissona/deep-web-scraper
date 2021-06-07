import React, { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import useIntersection from "../Hooks/useIntersrction";
import "../styles/PastesTable.css";

const PAGE_SIZE = 25;

function PastesTable() {
  const [state, setState] = useState({
    loading: true,
    pastes: [],
    openPaste: null,
    offset: PAGE_SIZE,
    offsetLoading: false,
  });

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

  const lastRowRef = useRef();
  const lastRowInView = useIntersection(lastRowRef, "0px");

  const morePastes = (e) => {
    if (lastRowInView) {
      setState({ ...state, offsetLoading: true });
      axios
        .get("http://localhost:3000/all-pastes?limit=25&offset=" + state.offset)
        .then((res) => {
          setState({
            ...state,
            offsetLoading: false,
            pastes: [...state.pastes, ...res.data],
            offset: state.offset + res.data.length,
          });
        });
    }
  };

  return state.loading ? (
    <Loader />
  ) : (
    <table id="main-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Author</th>
          <th>Title</th>
          <th>Content</th>
          <th>Views</th>
        </tr>
      </thead>
      <tbody onScroll={morePastes}>
        {state.pastes.map(makeRow)}
        <tr className="more-pastes" ref={lastRowRef}>
          <td>{state.offsetLoading ? "Loading More ..." : "No More Pastes"}</td>
        </tr>
      </tbody>
    </table>
  );

  function makeRow(post) {
    return (
      <tr
        key={post.id}
        onClick={() => setState({ ...state, openPaste: post.id })}
      >
        <td className="post-date">{new Date(post.date).toDateString()}</td>
        <td className="post-author">{post.author}</td>
        <td className="post-title">{post.title}</td>
        <td className="post-content">{post.text}</td>
        <td className="post-views">{post.views}</td>
      </tr>
    );
  }
}
export default PastesTable;
