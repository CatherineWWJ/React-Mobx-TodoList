import './index.css'
import { useStore } from '../store/index'
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import uuid from 'react-uuid' // 默认导出的写法

function Task() {
  const { taskStore } = useStore()

  // 单选受控
  // 思想：mobx Store去维护状态 input只需要把e.target.value 交给store让它来修改
  function onChange(e, id) {
    // console.log(e, id);
    taskStore.singleCheck(id, e.target.checked)
  }
  function allChange(e) {
    // console.log(e);
    taskStore.allCheck(e.target.checked)
  }
  function delTask(id) {
    taskStore.delTask(id)
  }
  // 新增
  const [taskValue, setTaskValue] = useState('')
  function addTask(e) {
    if (e.keyCode === 13) {
      taskStore.addTask({
        id: uuid(),
        name: taskValue,
        isDone: false
      })
      setTaskValue('')
    }
  }
  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        {/* 受控组件的常规写法 */}
        <input
          className="new-todo"
          value={taskValue}
          onChange={(e) => setTaskValue(e.target.value)}
          onKeyUp={addTask}
          autoFocus
          autoComplete="off"
          placeholder="What needs to be done?"
        />
      </header>
      <section className="main">
        {/* 全选 */}
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={taskStore.isAll}
          onChange={allChange}
        />
        <label htmlFor="toggle-all"></label>
        <ul className="todo-list">
          {/* completed类名标识 */}
          { taskStore.list.map(item => (
            <li
              className={item.isDone ? "todo completed" : "todo"}
              key={item.id}
            >
              <div className="view">
                {/* 单选框 受控和非受控 推荐受控的方式 */}
                <input
                className="toggle" type="checkbox"
                checked={item.isDone} onChange={(e) => {onChange(e, item.id)}}/>
                <label >{item.name}</label>
                <button className="destroy" onClick={() => {delTask(item.id)}}></button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <footer className='footer'>
        <span className='todo-count'>
          任务总数：{taskStore.list.length} 已完成：{taskStore.isFinishedLength}
        </span>
      </footer>
    </section>
  )
}

// 要mobx影响视图必须加observer
export default observer(Task)