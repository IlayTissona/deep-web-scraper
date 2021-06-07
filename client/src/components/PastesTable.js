import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import "../styles/PastesTable.css";

function PastesTable() {
  const [state, setState] = useState({
    loading: true,
    pastes: [],
    openPaste: null,
  });

  useEffect(() => {
    axios.get("http://localhost:3000/all-pastes").then((res) => {
      console.log(res.data);
      setState({ ...state, loading: false, pastes: res.data });
    });
  }, []);

  return state.loading ? (
    <Loader />
  ) : (
    <table id="main-table">
      <thead>
        <th>Date</th>
        <th>Author</th>
        <th>Title</th>
        <th>Content</th>
        <th>Views</th>
      </thead>
      <tbody>{state.pastes.map(makeRow)}</tbody>
    </table>
  );
}

function makeRow(post, index) {
  return (
    <tr key={index}>
      <td className="post-date">{new Date(post.date).toDateString()}</td>
      <td className="post-author">{post.author}</td>
      <td className="post-title">{post.title}</td>
      <td className="post-content">{post.text}</td>
      <td className="post-views">{post.views}</td>
    </tr>
  );
}

export default PastesTable;
