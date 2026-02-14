import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, Tooltip } from "recharts"
import bg from "./assets/bg.jpg"
import "./App.css"

function App(){

  const [task,setTask]=useState("")
  const [datetime,setDatetime]=useState("")
  const [tasks,setTasks]=useState([])

  useEffect(()=>{
    const saved=localStorage.getItem("tasks")
    if(saved) setTasks(JSON.parse(saved))
  },[])

  useEffect(()=>{
    localStorage.setItem("tasks",JSON.stringify(tasks))
  },[tasks])

  useEffect(()=>{
    const alarm=new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg")

    const interval=setInterval(()=>{
      const now=new Date()

      tasks.forEach((t,i)=>{
        if(t.done) return

        const diff=new Date(t.datetime)-now
        const fiveMin=5*60*1000

        if(diff<fiveMin && diff>fiveMin-60000 && !t.alert5){
          alarm.play()
          alert(`Reminder: ${t.text} due soon!`)
          tasks[i].alert5=true
          setTasks([...tasks])
        }
      })
    },60000)

    return ()=>clearInterval(interval)
  },[tasks])

  const addTask=()=>{
    if(!task||!datetime) return
    setTasks([...tasks,{text:task,datetime,done:false}])
    setTask("")
    setDatetime("")
  }

  const toggle=(i)=>{
    const newTasks=[...tasks]
    newTasks[i].done=!newTasks[i].done
    setTasks(newTasks)
  }

  const del=(i)=>{
    setTasks(tasks.filter((_,x)=>x!==i))
  }

  const today=new Date().toDateString()

  const todayTasks=tasks.filter(t=>new Date(t.datetime).toDateString()===today)
  const upcomingTasks=tasks.filter(t=>new Date(t.datetime).toDateString()!==today)

  const completed=tasks.filter(t=>t.done).length
  const pending=tasks.length-completed

  const data=[
    {name:"Done",value:completed},
    {name:"Pending",value:pending}
  ]

  return(
    <div style={styles.page}>

      <h1 style={styles.title}>✨ Smart Todo List</h1>

      <div style={styles.addBar}>
        <input placeholder="Task" value={task}
          onChange={e=>setTask(e.target.value)} style={styles.input}/>

        <input type="datetime-local" value={datetime}
          onChange={e=>setDatetime(e.target.value)} style={styles.input}/>

        <button style={styles.addBtn} onClick={addTask}>Add</button>
      </div>

      <div style={styles.container}>

        <div style={styles.box1} className="card">
          <h3>🔥 Today</h3>
          {todayTasks.map((t,i)=>(
            <div key={i} style={styles.task}>
              <input type="checkbox"
                checked={t.done}
                onChange={()=>toggle(tasks.indexOf(t))}
                style={styles.checkbox}/>
              <span style={styles.text}>{t.text}</span>
              <button style={styles.del}
                onClick={()=>del(tasks.indexOf(t))}>❌</button>
            </div>
          ))}
        </div>

        <div style={styles.box2} className="card">
          <h3>📌 Upcoming</h3>
          {upcomingTasks.map((t,i)=>(
            <div key={i} style={styles.task}>
              <input type="checkbox"
                checked={t.done}
                onChange={()=>toggle(tasks.indexOf(t))}
                style={styles.checkbox}/>
              <span style={styles.text}>{t.text}</span>
              <button style={styles.del}
                onClick={()=>del(tasks.indexOf(t))}>❌</button>
            </div>
          ))}
        </div>

      </div>

      {/* GRAPH */}
      <div style={{marginTop:"40px",textAlign:"center"}}>
        <h2 style={{color:"white"}}>📊 Progress</h2>

        <PieChart width={250} height={250}>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value">
            <Cell fill="#4CAF50"/>
            <Cell fill="#FF6B6B"/>
          </Pie>
          <Tooltip/>
        </PieChart>

        <p style={{color:"white"}}>
          {completed} completed / {tasks.length} total
        </p>
      </div>

    </div>
  )
}

export default App

const styles={
  page:{
    minHeight:"100vh",
    width:"100vw",
    backgroundImage:`url(${bg})`,
    backgroundSize:"cover",
    backgroundPosition:"center",
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    paddingTop:"30px"
  },

  title:{color:"white",fontSize:"32px",marginBottom:"20px"},

  addBar:{
    display:"flex",
    gap:"10px",
    padding:"12px",
    borderRadius:"15px",
    background:"linear-gradient(135deg,#6a11cb,#2575fc)",
    marginBottom:"25px"
  },

  input:{padding:"10px",borderRadius:"8px",border:"none"},

  addBtn:{
    background:"#2196F3",
    color:"white",
    border:"none",
    padding:"10px 18px",
    borderRadius:"8px",
    cursor:"pointer"
  },

  container:{display:"flex",gap:"20px"},

  box1:{
    width:"230px",
    padding:"15px",
    borderRadius:"15px",
    color:"white",
    background:"linear-gradient(135deg,#ff7e5f,#feb47b)"
  },

  box2:{
    width:"230px",
    padding:"15px",
    borderRadius:"15px",
    color:"white",
    background:"linear-gradient(135deg,#6a11cb,#2575fc)"
  },

  task:{display:"flex",alignItems:"center",gap:"10px",marginTop:"10px"},
  checkbox:{width:"24px",height:"24px"},
  text:{fontSize:"18px",fontWeight:"600"},
  del:{background:"transparent",border:"none",cursor:"pointer"}
}
