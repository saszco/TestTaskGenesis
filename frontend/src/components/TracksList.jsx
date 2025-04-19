import { useContext } from "react";
import { Spin } from "antd";
import { TracksContext } from "../store/tracks-context";
import TrackItem from "./TrackItem.jsx";

export default function TracksList() {
  const { tracks, loading } = useContext(TracksContext);

  return (
    <>
      {loading ? (
        <Spin spinning={loading} fullscreen />
      ) : (
        <div className="mx-8">
          {tracks && (
            <ul className="flex flex-col gap-4">
              {tracks.data?.map((track) => (
                <li key={track.id}><TrackItem {...track}/></li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
