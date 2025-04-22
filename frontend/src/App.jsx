import Header from "./components/Header";
import TracksList from "./components/TracksList";
import { TracksProvider } from "./store/tracks-context";

export default function App() {
    return (
      <>
        <TracksProvider>
          <Header />
          <TracksList />
        </TracksProvider>
      </>
    );
}