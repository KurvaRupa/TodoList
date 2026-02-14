import { useState, useEffect } from "react"
import bg from "./assets/bg.jpg"

function App() {

  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])

  // 🔹 Load tasks when app opens
  useEffect(() => {
    const saved = localStorage.getItem("myTasks")
    if (saved) {
      setTasks(JSON.parse(saved))
    }
  }, [])

  // 🔹 Save tasks whenever they change
  useEffect(() => {
    localStorage.setItem("myTasks", JSON.stringify(tasks))
  }, [tasks])


  const addTask = () => {
    if (!task.trim()) return
    setTasks([...tasks, { text: task, done: false }])
    setTask("")
  }

  const toggleTask = (i) => {
    const newTasks = [...tasks]
    newTasks[i].done = !newTasks[i].done
    setTasks(newTasks)
  }

  const deleteTask = (i) => {
    setTasks(tasks.filter((_, index) => index !== i))
  }

  const pending = tasks.filter(t => !t.done)
  const completed = tasks.filter(t => t.done)

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>🌸 My Todo List</h1>

        <div style={styles.inputBox}>
          <input
            style={styles.input}
            placeholder="Add a task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button style={styles.addBtn} onClick={addTask}>
            Add
          </button>
        </div>

        <h3>📌 Tasks To Do</h3>
        {pending.map((t, i) => (
          <div key={i} style={styles.task}>
            <input type="checkbox"
              onChange={() => toggleTask(tasks.indexOf(t))}
            />
            <span style={{ flex: 1 }}>{t.text}</span>
            <button onClick={() => deleteTask(tasks.indexOf(t))}>❌</button>
          </div>
        ))}

        <h3 style={{ marginTop: "20px" }}>✅ Completed</h3>
        {completed.map((t, i) => (
          <div key={i} style={styles.taskDone}>
            <span style={{ flex: 1, textDecoration: "line-through" }}>
              {t.text}
            </span>
            <button onClick={() => deleteTask(tasks.indexOf(t))}>❌</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App


const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.9)",
    padding: "30px",
    borderRadius: "20px",
    width: "380px",
    backdropFilter: "blur(8px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  inputBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },
  addBtn: {
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#ff6b81",
    color: "white",
    cursor: "pointer",
  },
  task: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    padding: "8px",
    background: "#f3f3f3",
    borderRadius: "8px",
  },
  taskDone: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    padding: "8px",
    background: "#dff0d8",
    borderRadius: "8px",
  },
}
