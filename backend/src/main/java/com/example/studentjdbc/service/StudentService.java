package com.example.studentjdbc.service;

import com.example.studentjdbc.exception.StudentNotFoundException;
import com.example.studentjdbc.model.Student;
import com.example.studentjdbc.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private static final String STUDENT_NOT_FOUND_PREFIX = "Student not found with id: ";

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student createStudent(Student student) {
        return studentRepository.create(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Integer id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(STUDENT_NOT_FOUND_PREFIX + id));
    }

    public Student updateStudent(Integer id, Student student) {
        studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(STUDENT_NOT_FOUND_PREFIX + id));
        studentRepository.update(id, student);
        student.setId(id);
        return student;
    }

    public void deleteStudent(Integer id) {
        studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(STUDENT_NOT_FOUND_PREFIX + id));
        studentRepository.delete(id);
    }
}

