import { useState, useEffect } from "react"
import bg from "./assets/bg.jpg"

function App() {

  const [task, setTask] = useState("")
  const [date, setDate] = useState("")
  const [tasks, setTasks] = useState([])

  // Load saved tasks
  useEffect(() => {
    const saved = localStorage.getItem("myTasks")
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  // Save tasks
  useEffect(() => {
    localStorage.setItem("myTasks", JSON.stringify(tasks))
  }, [tasks])

  // 🔔 Reminder check
  useEffect(() => {
    const today = new Date()

    tasks.forEach(t => {
      const taskDate = new Date(t.date)
      const diff = (taskDate - today) / (1000 * 60 * 60 * 24)

      if (diff <= 1 && diff > 0 && !t.done) {
        alert(`Reminder: "${t.text}" is due tomorrow!`)
      }
    })
  }, [tasks])

  const addTask = () => {
    if (!task || !date) return
    setTasks([...tasks, { text: task, date, done: false }])
    setTask("")
    setDate("")
  }

  const toggleTask = i => {
    const newTasks = [...tasks]
    newTasks[i].done = !newTasks[i].done
    setTasks(newTasks)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>📅 Todo with Reminder</h1>

        <input
          style={styles.input}
          placeholder="Task"
          value={task}
          onChange={e => setTask(e.target.value)}
        />

        <input
          type="date"
          style={styles.input}
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <button style={styles.addBtn} onClick={addTask}>
          Add Task
        </button>

        <h3>Tasks</h3>
        {tasks.map((t, i) => (
          <div key={i} style={styles.task}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTask(i)}
            />
            <span style={{
              textDecoration: t.done ? "line-through" : "none"
            }}>
              {t.text} ({t.date})
            </span>
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
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "rgba(255,255,255,0.9)",
    padding: "30px",
    borderRadius: "20px",
    width: "350px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },
  addBtn: {
    padding: "10px",
    width: "100%",
    background: "#ff6b81",
    color: "white",
    border: "none",
  },
  task: {
    marginTop: "10px",
  },
}
