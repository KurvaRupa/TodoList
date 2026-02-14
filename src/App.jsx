import { useState, useEffect } from "react"
import bg from "./assets/bg.jpg"

function App() {

  const [task, setTask] = useState("")
  const [datetime, setDatetime] = useState("")
  const [tasks, setTasks] = useState([])

  // 🔊 Alarm sound file
  const alarm = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg")

  // Load saved tasks
  useEffect(() => {
    const saved = localStorage.getItem("tasks")
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  // Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  // Notification permission
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission()
    }
  }, [])

  // 🔔 5 MINUTE ALARM
  useEffect(() => {

    const interval = setInterval(() => {

      const now = new Date()

      tasks.forEach((t, i) => {

        if (t.done) return

        const taskTime = new Date(t.datetime)
        const diff = taskTime - now
        const fiveMin = 5 * 60 * 1000

        if (diff < fiveMin && diff > fiveMin - 60000 && !t.alarm5) {

          alarm.play()

          new Notification("⏰ Task Reminder", {
            body: `${t.text} in 5 minutes!`
          })

          tasks[i].alarm5 = true
          setTasks([...tasks])
        }

      })

    }, 60000)

    return () => clearInterval(interval)

  }, [tasks])

  const addTask = () => {
    if (!task || !datetime) return
    setTasks([...tasks, { text: task, datetime, done: false, alarm5: false }])
    setTask("")
    setDatetime("")
  }

  const toggle = i => {
    const newTasks = [...tasks]
    newTasks[i].done = !newTasks[i].done
    setTasks(newTasks)
  }

  // 📅 GROUP TASKS BY DATE
  const grouped = {}
  tasks.forEach(t => {
    const d = new Date(t.datetime).toDateString()
    if (!grouped[d]) grouped[d] = []
    grouped[d].push(t)
  })

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>📅 Smart Todo</h1>

        <input
          style={styles.input}
          placeholder="Task"
          value={task}
          onChange={e => setTask(e.target.value)}
        />

        <input
          type="datetime-local"
          style={styles.input}
          value={datetime}
          onChange={e => setDatetime(e.target.value)}
        />

        <button style={styles.addBtn} onClick={addTask}>
          Add Task
        </button>

        <h3>📊 Calendar View</h3>

        {Object.keys(grouped).map(date => (
          <div key={date} style={styles.dateBox}>
            <b>{date}</b>

            {grouped[date].map((t, i) => (
              <div key={i} style={styles.task}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggle(tasks.indexOf(t))}
                />
                {t.text} – {new Date(t.datetime).toLocaleTimeString()}
              </div>
            ))}
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
    width: "360px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },
  addBtn: {
    width: "100%",
    padding: "10px",
    background: "#ff6b81",
    color: "white",
    border: "none",
  },
  dateBox: {
    marginTop: "15px",
    padding: "10px",
    background: "#f0f0f0",
    borderRadius: "8px",
  },
  task: {
    marginLeft: "10px",
    marginTop: "5px",
  }
}
