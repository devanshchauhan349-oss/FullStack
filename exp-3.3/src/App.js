import React from "react";
import { Person, Student, Teacher } from "./entities";
import "./App.css";

function App() {
  const person = new Person("Raj", 30);
  const student = new Student("Dev", 20, "Computer Science");
  const teacher = new Teacher("Josh", 45, "Mathematics");

  return (
    <div className="app-container">
      <h1>Person Class Hierarchy</h1>

      <div className="card person-card">
        <h2>{person.name} (Person)</h2>
        <p>Age: {person.age}</p>
        <p>Hello, my name is {person.name}.</p>
      </div>

      <div className="card student-card">
        <h2>{student.name} (Student)</h2>
        <p>Age: {student.age}</p>
        <p>
          Hello, my name is {student.name} and I'm studying {student.grade}.
        </p>
        <p><strong>Major:</strong> {student.grade}</p>
      </div>

      <div className="card teacher-card">
        <h2>{teacher.name} (Teacher)</h2>
        <p>Age: {teacher.age}</p>
        <p>
          Hello, my name is {teacher.name} and I teach {teacher.subject}.
        </p>
        <p><strong>Teaching:</strong> {teacher.subject}</p>
      </div>
    </div>
  );
}

export default App;