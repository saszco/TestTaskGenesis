import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react";
import { GenresContext } from "../store/genres-context";
import { Spin, Tag, Alert } from "antd";
import { validateInputValue, validateImageUrl } from "../utils/validation";
import { TracksContext } from "../store/tracks-context";
const DEFAULT_IMG_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Apple_Music_icon.svg/2048px-Apple_Music_icon.svg.png";

const TrackDataInput = forwardRef(function ({isEditing, trackId}, ref) {
  const { genres, loading } = useContext(GenresContext);
  const { tracks } = useContext(TracksContext);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [formState, setFormState] = useState({
    title: "",
    artist: "",
    album: "",
    coverImage: "",
  });
  const preData = tracks.data?.find((track) => track.id === trackId); 

  useEffect(() => {
    if (isEditing && preData) {
      setFormState({
        title: preData.title || "",
        artist: preData.artist || "",
        album: preData.album || "",
        coverImage: preData.coverImage || ""
      })
      setSelectedGenres(preData.genres || [])
    }
  }, [isEditing, preData]);

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const { title, artist, album, coverImage } = formState;

      let errors = [];

      const isTitleValid = validateInputValue(title, "title", 1, 100, errors);
      const isArtistValid = validateInputValue(
        artist,
        "artist",
        1,
        100,
        errors
      );
      const isAlbumValid = validateInputValue(album, "album", 1, 100, errors);
      const isCoverImageValid = await validateImageUrl(
        coverImage,
        "coverImage",
        errors
      ); //look at this later about data-testid attribute

      setValidationErrors(errors);

      if (!isTitleValid || !isArtistValid || !isAlbumValid || !isCoverImageValid) {
        console.log(errors);
        return null;
      }

      return {
        ...formState,
        coverImage:
          coverImage.trim() || DEFAULT_IMG_URL,
        genres: selectedGenres,
      };
    },
    resetForm: () => {
      setFormState({
        title: "",
        artist: "",
        album: "",
        coverImage: "",
      });
      setSelectedGenres([]);
      setDropdownOpen(false);
      setValidationErrors([]);
    }
  }));

  function hasError(fieldName) {
    return validationErrors.some((error) => error.fieldName === fieldName);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormState((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  }

  function handleAddGenre(genre) {
    if (!selectedGenres.includes(genre)) {
      setSelectedGenres((prevGenres) => [...prevGenres, genre]);
    }
  }

  function handleRemoveGenre(genre) {
    const updatedGenres = selectedGenres.filter((g) => g !== genre);
    setSelectedGenres(updatedGenres);
  }

  return (
    <form
      action=""
      data-testid="track-form"
      className="flex flex-col gap-5 mt-5 mb-10"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-lg text-blue-400">
          Song title
        </label>
        <input
          data-testid="input-title"
          id="title"
          type="text"
          name="title"
          value={formState.title}
          onChange={handleInputChange}
          className={`border-2 rounded-md p-2 text-blue-300 ${
            hasError("title") ? "border-red-300 bg-red-50" : "border-blue-200"
          }`}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="artist" className="text-lg text-blue-400">
          Artist name
        </label>
        <input
          data-testid="input-artist"
          id="artist"
          type="text"
          name="artist"
          value={formState.artist}
          onChange={handleInputChange}
          className={`border-2 rounded-md p-2 text-blue-300 ${
            hasError("artist") ? "border-red-300 bg-red-50" : "border-blue-200"
          }`}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="album" className="text-lg text-blue-400">
          Album name
        </label>
        <input
          data-testid="input-album"
          id="album"
          type="text"
          name="album"
          value={formState.album}
          onChange={handleInputChange}
          className={`border-2 rounded-md p-2 text-blue-300 ${
            hasError("album") ? "border-red-300 bg-red-50" : "border-blue-200"
          }`}
        />
      </div>
      <div className="flex flex-row place-content-between items-center">
        <div className="flex flex-col gap-1 w-3/4">
          <label htmlFor="coverImage" className="text-lg text-blue-400">
            Add a url link{" "}
            <span className="text-sm text-blue-300">
              to the photo for the cover
            </span>
          </label>
          <input
            data-testid="input-cover-image"
            id="coverImage"
            type="text"
            name="coverImage"
            placeholder="Or the cover will be set by default image"
            value={formState.coverImage}
            onChange={handleInputChange}
            className={`border-2 rounded-md p-2 placeholder-blue-300 text-blue-300 ${
              hasError("coverImage")
                ? "border-red-300 bg-red-50"
                : "border-blue-200"
            }`}
          />
        </div>
        {formState.coverImage?.trim() ? (
          <img
            src={formState.coverImage}
            alt="Cover preview"
            className="w-18 h-18 mr-1.5 object-cover border-2 border-blue-300 rounded-xl"
          />
        ) : (
          <div className="w-18 h-18 mr-1.5 border-2 border-blue-300 rounded-xl"></div>
        )}
      </div>

      {validationErrors && (
        <ul className="flex flex-col gap-2">
          {validationErrors.map((error) => (
            <Alert
              data-testid={error.testIdAttribute}
              message={error.message}
              key={error.message}
              type="info"
              showIcon
            />
          ))}
        </ul>
      )}

      {loading ? (
        <Spin />
      ) : (
        <div data-testid="genre-selector" className="flex flex-col gap-2">
          <label className="text-lg text-blue-400">Genres</label>
          <div className="flex flex-col gap-3 items-start">
            <div className="flex flex-wrap gap-1 w-full border-2 border-blue-100 rounded-md min-h-10 p-2">
              {selectedGenres?.map((genre) => (
                <Tag color="blue" key={genre}>
                  <span key={genre} className="flex items-center gap-1">
                    {genre}
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(genre)}
                    >
                      <i class="fa fa-times" aria-hidden="true"></i>
                    </button>
                  </span>
                </Tag>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDropdownOpen((prevState) => !prevState)}
              className="text-blue-400 hover:text-blue-500"
            >
              {isDropdownOpen ? (
                <i class="fa fa-eye-slash" aria-hidden="true"></i>
              ) : (
                <i class="fa fa-plus" aria-hidden="true"></i>
              )}
              {isDropdownOpen ? " Hide" : " Click"}
            </button>
          </div>
          {isDropdownOpen && (
            <div className="flex flex-wrap gap-1">
              {genres
                .filter((g) => !selectedGenres?.includes(g))
                .map((genre) => (
                  <Tag color="geekblue" key={genre}>
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleAddGenre(genre)}
                    >
                      {genre}
                    </button>
                  </Tag>
                ))}
            </div>
          )}
        </div>
      )}
    </form>
  );
});

export default TrackDataInput;
