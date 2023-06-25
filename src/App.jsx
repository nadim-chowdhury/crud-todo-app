import { useState, useEffect } from "react";

import "./App.css";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [searchValue, setSearchValue] = useState([]);
  const [sortValue, setSortValue] = useState("");

  console.log(searchValue);

  const sortOptions = ["id", "userId", "title", "completed"];
  const dataUrl = "https://jsonplaceholder.typicode.com/todos";

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    axios
      .get(dataUrl)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    return setSearchValue(
      data.filter((d) => query && d.title.toLowerCase().includes(query))
    );
  };

  const handleReset = () => {
    loadUserData();
    setQuery("");
    setSearchValue([]);
  };

  return (
    <main className="p-4">
      <div className="d-flex justify-content-between mb-4">
        <h2 className="fw-bold">CRUD Todo</h2>
        <form className="d-flex" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-control"
            value={query}
            onChange={(e) => setQuery(e.target.value.toLowerCase())}
          />
          <button type="submit" className="px-4 btn btn-primary me-2">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <button className="px-4 btn btn-warning" onClick={handleReset}>
            Reset
          </button>
        </form>
      </div>

      <div className="mb-4">
        <select className="form-select" aria-label="Default select example">
          <option selected>Open this select menu</option>
          {sortOptions.map((o) => (
            <>
              <option value={o} className="text-capitalize cursor-pointer">
                {o}
              </option>
            </>
          ))}
        </select>
      </div>

      <table className="table table-striped">
        <thead>
          <tr className="text-uppercase">
            <th scope="col">Id</th>
            <th scope="col">User Id</th>
            <th scope="col">Title</th>
            <th scope="col">Completed</th>
            <th scope="col">More</th>
          </tr>
        </thead>
        <tbody className="text-capitalize">
          {searchValue.length() > 0
            ? searchValue.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.userId}</td>
                  <td>{d.title}</td>
                  <td>{d.completed.toString()}</td>
                  <td>
                    <button className="btn btn-success me-2">Edit</button>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            : data.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.userId}</td>
                  <td>{d.title}</td>
                  <td>{d.completed.toString()}</td>
                  <td>
                    <button className="btn btn-success me-2">Edit</button>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
