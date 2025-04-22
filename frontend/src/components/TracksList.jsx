import { useContext, useRef } from "react";
import { Spin } from "antd";
import { TracksContext } from "../store/tracks-context";
import TrackItem from "./TrackItem.jsx";
import PaginationBox from "./PaginationBox.jsx";

export default function TracksList() {
  const { tracks, loading } = useContext(TracksContext);
  const currentAudioRef = useRef(null);

  console.log(tracks)

  const handleCurrentPlayingTrack = (newAudio) => {
    if(currentAudioRef.current && currentAudioRef.current !== newAudio){
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    currentAudioRef.current = newAudio;
  }

  return (
    <>
      {tracks.data?.length === 0 && (
        <p className="text-center text-3xl text-blue-300 font-light mt-10">There are no matched tracks</p>
      )}
      {loading ? (
        <Spin spinning={loading} fullscreen />
      ) : (
        <div className="mx-8 mb-8 min-h-3/4">
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
