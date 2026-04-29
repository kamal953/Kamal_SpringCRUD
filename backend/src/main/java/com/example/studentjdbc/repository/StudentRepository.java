package com.example.studentjdbc.repository;

import com.example.studentjdbc.model.Student;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class StudentRepository {

    private final JdbcTemplate jdbcTemplate;

    public StudentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

        private static final @NonNull RowMapper<Student> STUDENT_ROW_MAPPER = (rs, rowNum) -> new Student(
            rs.getInt("id"),
            rs.getString("name"),
            rs.getString("email"),
            rs.getString("course")
    );

    public Student create(Student student) {
        String sql = "INSERT INTO students(name, email, course) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, student.getName());
            ps.setString(2, student.getEmail());
            ps.setString(3, student.getCourse());
            return ps;
        }, keyHolder);

        Number generatedId = keyHolder.getKey();
        student.setId(generatedId != null ? generatedId.intValue() : null);
        return student;
    }

    public List<Student> findAll() {
        String sql = "SELECT id, name, email, course FROM students ORDER BY id";
        return jdbcTemplate.query(sql, STUDENT_ROW_MAPPER);
    }

    public Optional<Student> findById(Integer id) {
        String sql = "SELECT id, name, email, course FROM students WHERE id = ?";
        List<Student> students = jdbcTemplate.query(sql, STUDENT_ROW_MAPPER, id);
        return students.stream().findFirst();
    }

    public boolean update(Integer id, Student student) {
        String sql = "UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?";
        int rows = jdbcTemplate.update(sql, student.getName(), student.getEmail(), student.getCourse(), id);
        return rows > 0;
    }

    public boolean delete(Integer id) {
        String sql = "DELETE FROM students WHERE id = ?";
        int rows = jdbcTemplate.update(sql, id);
        return rows > 0;
    }
}
