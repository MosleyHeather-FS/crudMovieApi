import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';

import "../App.css";

function Recomend() {
  const [movies, setMovies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    name: "",
    class: "",
  });

  const { id } = useParams()

  const API_BASE =
    process.env.NODE_ENV === "development"
      ? `http://localhost:8000/api/v1`
      : process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      getMovies();
    }

    return () => {
      ignore = true;
    };
  }, []);

  const getMovies = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/movies`)
        .then((res) => res.json())
        .then((data) => {
          console.log({ data });
          setMovies(data);
        });
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  const createMovie = async () => {
      try {
          await fetch(`${API_BASE}/movies`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(values)
          })
                    .then(() => getMovies())
        } catch(error) {
          setError(error.message || "Unexpected Error")
        } finally {
          setLoading(false)
        }
  }

  const handleSubmit = (event) => {
      event.preventDefault();
      createMovie();
  }

  const handleInputChanges = (event) => {
      event.persist();
      setValues((values) => ({
          ...values,
          [event.target.name]: event.target.value
      }))
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <Link to="/">Home</Link>
        <p>Know some great movies that you think I should see? 
          Add them below! I'll definitely check them out!</p>
        <form onSubmit={(event) => handleSubmit(event)}>
            <label>
                Name:
                <input type="text" name="name" value={values.name} onChange={handleInputChanges} />
            </label>
            <label>
                Genre:
                <input type="text" name="genre" value={values.genre} onChange={handleInputChanges} />
            </label>
            <label>
                Rating:
                <input type="text" name="rating" value={values.rating} onChange={handleInputChanges} />
            </label>
            <input type="submit" value="Submit" />
        </form>
      </header>
    </div>
  );
}

export default Recomend;
