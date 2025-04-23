import AddTrack from "./AddTrack.jsx";
import { useContext } from "react";
import { TracksContext } from "../store/tracks-context.jsx";
import { Select, Button, Divider, Tag, Input, Switch } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";

function tagRender({ label, onClose }) {
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color="blue"
      onMouseDown={onPreventMouseDown}
      closable={true}
      onClose={onClose}
    >
      {label}
    </Tag>
  );
}

export default function OperationsBar() {
  const {
    sortBy,
    order,
    setSortBy,
    setOrder,
    genres,
    setSelectedGenresForFilter,
    initialTracks,
    setSelectedArtistForFilter,
    search,
    setSearch
  } = useContext(TracksContext);

  const options = genres.map((genre) => ({
    value: genre,
  }));

  const artists = [
    ...new Set(initialTracks.data?.map((track) => track.artist)),
  ].sort();

  const artistsOptions = artists.map((artist) => ({
    value: artist,
  }));

  return (
    <div className="flex flex-row flex-wrap items-center gap-2 mr-4 my-4">
      <AddTrack />
      <Divider type="vertical" style={{ borderColor: "#2c8bc7", height: 30 }} />
      <div className="flex flex-row items-center gap-2">
        <Select
          allowClear
          size="large"
          style={{ width: 100 }}
          placeholder="Sort by"
          onChange={(value) => setSortBy(value || null)}
          options={[
            { label: "Title", value: "title" },
            { label: "Artist", value: "artist" },
            { label: "Album", value: "album" },
          ]}
        />
        <Button
          size="large"
          color="primary"
          variant={order === "asc" ? "solid" : "outlined"}
          onClick={() => setOrder("asc" || null)}
          disabled={!sortBy}
        >
          A-Z
        </Button>
        <Button
          size="large"
          color="primary"
          variant={order === "desc" ? "solid" : "outlined"}
          onClick={() => setOrder("desc" || null)}
          disabled={!sortBy}
        >
          Z-A
        </Button>
      </div>
      <Divider type="vertical" style={{ borderColor: "#2c8bc7", height: 30 }} />
      <Select
        className="nowrap-select"
        allowClear
        mode="multiple"
        tagRender={tagRender}
        style={{ width: 160 }}
        size="large"
        options={options}
        onChange={(value) => setSelectedGenresForFilter(value || [])}
        placeholder="Filter by genres"
      />
      <Divider type="vertical" style={{ borderColor: "#2c8bc7", height: 30 }} />
      <Select
        allowClear
        showSearch
        placeholder="Filter by artist"
        prefix={<UserOutlined />}
        style={{ width: 165 }}
        size="large"
        options={artistsOptions}
        onChange={(value) => setSelectedArtistForFilter(value || [])}
      />
      <Divider type="vertical" style={{ borderColor: "#2c8bc7", height: 30 }} />
      <Input
        size="large"
        style={{ width: 170 }}
        prefix={<SearchOutlined />}
        placeholder="Search.."
        value={search || ""}
        onChange={(event) => setSearch(event.target.value)}
      />
    </div>
  );
}
