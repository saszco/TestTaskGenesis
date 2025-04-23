import OperationsBar from "./OperationsBar";

export default function Header() {
  return (
    <header
      data-testid="tracks-header"
      className="flex flex-wrap items-center justify-between border-2 p-3 rounded-xl m-8 border-blue-400 bg-blue-100"
    >
      <div className="flex flex-row items-center gap-4">
        <img src="/genMusicNesis-logo.png" className="w-24" />
        <h1 className="text-3xl text-blue-500 max-sm:text-xl">
          Ge<span className="text-blue-700">Music</span>Nesis
        </h1>
      </div>
      <OperationsBar />
    </header>
  );
}
