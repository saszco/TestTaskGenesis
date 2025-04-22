import { useContext, useRef } from "react";
import { Spin } from "antd";
import { TracksContext } from "../store/tracks-context";
import TrackItem from "./TrackItem.jsx";
import PaginationBox from "./PaginationBox.jsx";

export default function TracksList() {
  const { tracks, loading } = useContext(TracksContext);
  const currentAudioRef = useRef(null);

  const handleCurrentPlayingTrack = (newAudio) => {
    if(currentAudioRef.current && currentAudioRef.current !== newAudio){
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    currentAudioRef.current = newAudio;
  }

  return (
    <>
      {loading ? (
        <Spin spinning={loading} fullscreen />
      ) : (
        <div className="mx-8 mb-8">
          {tracks && (
            <ul className="flex flex-col gap-4">
              {tracks.data?.map((track) => (
                <li key={track.id}>
                  <TrackItem {...track} onPlay={handleCurrentPlayingTrack} />
                </li>
              ))}
            </ul>
          )}
          <PaginationBox totalPages={tracks.meta?.totalPages}/>
        </div>
      )}
    </>
  );
}
