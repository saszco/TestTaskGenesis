import Header from "./components/Header";
import TracksList from "./components/TracksList";
import { GenresProvider } from "./store/genres-context";
import { TracksProvider } from "./store/tracks-context";

export default function App() {
    return (
      <>
        <TracksProvider>
          <GenresProvider>
            <Header />
            <TracksList />
          </GenresProvider>
        </TracksProvider>
      </>
    );
}