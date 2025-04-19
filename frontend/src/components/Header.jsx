import AddTrack from "./AddTrack.jsx";
import { useContext } from "react";
import { TracksContext } from "../store/tracks-context.jsx";

export default function Header () {
  const { tracks } = useContext(TracksContext)

  console.log(tracks)

    return (
      <header data-testid="tracks-header" className='flex flex-wrap items-center justify-between border-2 p-6 rounded-xl m-8 border-blue-400 bg-blue-50'>
        <h1 className='text-3xl text-blue-500'>Ge<span className='text-blue-700'>Music</span>Nesis</h1>
        <div>
            <AddTrack/>
        </div>
      </header>
    );
}