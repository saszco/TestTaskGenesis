import AddTrack from "./AddTrack.jsx";
import { useContext, useEffect, useState } from "react";
import { TracksContext } from "../store/tracks-context.jsx";
import { Select, Button, Divider } from "antd";

export default function Header () {
  const { sortBy, order, setSortBy, setOrder } = useContext(TracksContext)

    return (
      <header
        data-testid="tracks-header"
        className="flex flex-wrap items-center justify-between border-2 p-6 rounded-xl m-8 border-blue-400 bg-blue-50"
      >
        <h1 className="text-3xl text-blue-500">
          Ge<span className="text-blue-700">Music</span>Nesis
        </h1>
        <div className="flex flex-row flex-wrap items-center gap-4">
          <AddTrack />
          <Divider type="vertical" style={{ borderColor: '#2c8bc7', height: 30 }}/>
          <Select
            size="large"
            style={{ width: 160 }}
            placeholder="Sort by"
            onChange={(value) => setSortBy(value)}
            options={[
              { label: "Title", value: "title" },
              { label: "Artist", value: "artist" },
              { label: "Album", value: "album" }
            ]}
          />
          <Button
            size="large"
            color="primary"
            variant={order === "asc" ? "solid" : "outlined"}
            onClick={() => setOrder("asc")}
            disabled={!sortBy}
          >
            A-Z
          </Button>
          <Button
            size="large"
            color="primary"
            variant={order === "desc" ? "solid" : "outlined"}
            onClick={() => setOrder("desc")}
            disabled={!sortBy}
          >
            Z-A
          </Button>
        </div>
      </header>
    );
}