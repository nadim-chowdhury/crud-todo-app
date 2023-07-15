import { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import { Link } from "react-router-dom";

function Todo() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [searchValue, setSearchValue] = useState([]);
  const [sortValue, setSortValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const sortOptions = ["userId", "title", "completed"];
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

  const handleSearch = (e) => {
    e.preventDefault();

    setSearchValue(
      data.filter((d) => query && d.title.toLowerCase().includes(query))
    );
  };

  const handleReset = () => {
    loadUserData();
    setQuery("");
    setSearchValue([]);
    setSortValue("");
  };

  const handleSort = (e) => {
    const value = e.target.value.toString();
    setSortValue(value);

    if (value) {
      const sortedData = [...data].sort((a, b) => {
        if (value === "userId") {
          return a.userId - b.userId;
        } else if (value === "title") {
          return a.title.localeCompare(b.title);
        } else if (value === "completed") {
          return a.completed - b.completed;
        }
      });

      setData(sortedData);
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedData = Array.from(
      searchValue.length > 0 ? searchValue : data
    );
    const [removed] = reorderedData.splice(result.source.index, 1);
    reorderedData.splice(result.destination.index, 0, removed);

    setSearchValue(reorderedData);
  };

  const openModal = (data) => {
    setModalData(data);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalData(null);
    setModalIsOpen(false);
  };

  const handleCreate = (newTodo) => {
    axios
      .post(dataUrl, newTodo)
      .then((res) => {
        const createdTodo = res.data;
        setData((prevData) => [...prevData, createdTodo]);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdate = (id, updatedTodo) => {
    axios
      .put(`${dataUrl}/${id}`, updatedTodo)
      .then((res) => {
        const updatedTodo = res.data;
        setData((prevData) => {
          const newData = [...prevData];
          const index = newData.findIndex((item) => item.id === id);
          if (index !== -1) {
            newData[index] = updatedTodo;
          }
          return newData;
        });
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`${dataUrl}/${id}`)
      .then(() => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch((err) => console.log(err));
  };

  const itemsPerPage = 10;
  const offset = currentPage * itemsPerPage;
  const paginatedData = searchValue.length > 0 ? searchValue : data;
  const currentPageData = paginatedData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(paginatedData.length / itemsPerPage);

  return (
    <main className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">CRUD Todo</h2>
          <Link to="https://nadim.vercel.app" className="text-decoration-none">
            Developed by Nadim Chowdhury
          </Link>
        </div>

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
        <select
          className="form-select"
          aria-label="Default select example"
          value={sortValue}
          onChange={handleSort}
        >
          <option value="">Filter with ...</option>
          {sortOptions.map((item, i) => (
            <option
              value={item}
              key={i}
              className="text-capitalize cursor-pointer"
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <table
              className="table table-striped"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
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
                {currentPageData.map((d, index) => (
                  <Draggable
                    key={d.id}
                    draggableId={d.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <tr
                        key={d.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <td>{d.id}</td>
                        <td>{d.userId}</td>
                        <td>{d.title}</td>
                        <td>{d.completed.toString()}</td>
                        <td>
                          <button
                            className="btn btn-info me-2"
                            onClick={() =>
                              handleUpdate(d.id, {
                                ...d,
                                title: "Updated Title",
                              })
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(d.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-success ms-2"
                            onClick={() => openModal(d)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        previousLinkClassName={"page-link btn btn-success me-2"}
        nextLinkClassName={"page-link btn btn-success ms-2"}
        disabledClassName={"disabled"}
        activeClassName={"active"}
        pageClassName={"btn btn-primary mx-1"}
        breakClassName={"btn btn-primary"}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Todo Details"
        ariaHideApp={false}
        style={{ className: "container" }}
      >
        <div>
          {modalData && (
            <>
              <h2 className="text-capitalize">{modalData.title}</h2>
              <p>User ID: {modalData.userId}</p>
              <p>Completed: {modalData.completed.toString()}</p>
            </>
          )}
        </div>
        <button className="btn btn-danger" onClick={closeModal}>
          Close
        </button>
      </Modal>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.elements.title.value;
          const userId = Number(e.target.elements.userId.value);
          const completed = e.target.elements.completed.checked;
          const newTodo = {
            title,
            userId,
            completed,
          };
          handleCreate(newTodo);
          e.target.reset();
        }}
      >
        <input type="text" placeholder="Title" name="title" />
        <input type="number" placeholder="User ID" name="userId" />
        <input type="checkbox" placeholder="Completed" name="completed" />
        <button type="submit">Create</button>
      </form>
    </main>
  );
}

export default Todo;
