import { useState, useEffect } from "react";
import "./App.css";
import TodoApp from "./components/TodoApp/TodoApp";
import WelcomePage from "./components/welcomePage/WelcomePage";
import axios from "axios";
const DATA = [
    { id: "todo-0", name: "Eat", completed: true },
    { id: "todo-1", name: "Sleep", completed: false },
    { id: "todo-2", name: "Repeat", completed: false },
];
function App() {
    const [email, setEmail] = useState(localStorage.getItem("email"));
    const [name, setName] = useState(localStorage.getItem("name"));
    return (
        <div className="App">
            {!email ? <WelcomePage /> : <TodoApp tasks={DATA} />}
        </div>
    );
}

export default App;
