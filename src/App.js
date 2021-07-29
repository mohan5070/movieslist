import { useCallback, useEffect, useState } from "react";
import "./styles.css";

function useDebounce(func, delay) {
  let timer = null;

  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(func.apply(context, ...args), delay);
  };
}

export default function App() {
  const [search, setSearch] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [movieDetails, setMovieDetails] = useState({});

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?apiKey=47685029&s=${search}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.Response === "True") {
          setMoviesList(res.Search);
        } else {
          setMoviesList([]);
        }
      });
  }, [search]);

  const handleSearch = useCallback(
    (e) => {
      setSearch(e.target.value);
    },
    [search]
  );

  const onSelect = useCallback(
    (e, detail) => {
      console.log(detail);
      setMovieDetails({ ...detail });
    },
    [search, movieDetails]
  );

  const debouncedSearch = useDebounce(handleSearch, 200);
  const { Title, Year, Poster, imdbID, Type } = movieDetails;
  return (
    <div className="App">
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search Movie"
      />
      {!moviesList.length && <div>Search is not found</div>}
      <div class="options-container">
        <ul>
          {moviesList.length > 0 &&
            moviesList.map((movie) => {
              return (
                <li key={movie.Title} onClick={(e) => onSelect(e, movie)}>
                  {" "}
                  {movie.Title}{" "}
                </li>
              );
            })}
        </ul>
      </div>
      {Title && (
        <div className="details-container">
          <div>{Title}</div>
          <div>{Year}</div>
          <div>{Type}</div>
          <div>{imdbID}</div>
          <div>
            <img src={Poster} alt="movie banner" />
          </div>
        </div>
      )}
    </div>
  );
}
