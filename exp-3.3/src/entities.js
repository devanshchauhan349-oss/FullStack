// entities.js

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getDetails() {
    return `${this.name}, Age: ${this.age}`;
  }
}

class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }

  getDetails() {
    return `${super.getDetails()}, Grade: ${this.grade}`;
  }
}

class Teacher extends Person {
  constructor(name, age, subject) {
    super(name, age);
    this.subject = subject;
  }

  getDetails() {
    return `${super.getDetails()}, Teaches: ${this.subject}`;
  }
}

export { Person, Student, Teacher };