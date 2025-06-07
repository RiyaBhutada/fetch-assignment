import { useState } from "react";
import Login from "./pages/Login";
import DogSearch from "./pages/DogSearch";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      {loggedIn ? <DogSearch /> : <Login onLogin={() => setLoggedIn(true)} />}
    </>
  );
}
