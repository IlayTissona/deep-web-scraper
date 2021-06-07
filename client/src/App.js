import "./styles/App.css";
import PastesTable from "./components/PastesTable";

function App() {
  return (
    <div className="App">
      <PastesTable />
      <div id="header">
        <h3>Stronghold Scraper</h3>
        <h4>NOTE</h4>
        <div>
          This website shows content from a deep/dark web paste holder. Pastes
          may contain illegal, or even worse than just illegal content. Be
          responsible, chose the right path.
        </div>
      </div>
    </div>
  );
}

export default App;
