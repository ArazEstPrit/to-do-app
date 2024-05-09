# To-Do App Roadmap

I'm outlining these as prerequisites for progressing to each version.
(? = I’m not certain about this feature)

## 0.1.0

- [x] Basic Task Operations
  - [x] Add task
    - [x] Name
      - [x] Due Date
    - [x] Complete task (same as deleting)
    - [x] View task
      - [x] Sort by due date: soonest = first
- [x] Database: JSON
- [x] Basic CLI

## 1.0.0

- [ ] Task Details:
  - [ ] Description
  - [ ] Customizable task statuses
  - [ ] Tags
  - [ ] Priority score
    - [ ] Effort: 1-6
    - [ ] Importance: 1-6
    - [ ] Score calculated: Importance/Effort
    - [ ] Due date closer -> higher priority
- [ ] Task Operations:
  - [ ] Edit Task
  - [ ] Complete task (without deletion)
  - [ ] View Tasks
    - [ ] By tags
    - [ ] Sort Priority score
- [ ] Migrate to SQLite database?
- [ ] UI:
  - [ ] CLI improvements
  - [ ] Basic GUI - web app (use React?)

## 2.0.0

- [ ] Task Details:
  - [ ] Duration: time required to complete
  - [ ] Planned date: scheduling for task completion
  - [ ] Recurring tasks: Set tasks to repeat at specified intervals (daily, weekly, monthly, etc.).
  - [ ] Subtasks
- [ ] Time Management:
  - [ ] View Timetable (See when allotted to do tasks)
- [ ] Analytics:
  - [ ] Basic Statistics
- [ ] User Interface:
  - [ ] Improved CLI:
    - [ ] Some TUI aspects?
  - [ ] Improved GUI
    - [ ] Customizable themes?
- [ ] Task Management:
  - [ ] Task folder/groups?
  - [ ] Customizable priority score - user defined flags that multiply score?
- [ ] Integration:
  - [ ] API for 3rd party integration?

## 3.0.0

- [ ] Task synchronization across multiple devices
- [ ] Mobile port
