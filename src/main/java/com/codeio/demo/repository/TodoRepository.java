package com.codeio.demo.repository;

import com.codeio.demo.entity.Todo;
import com.codeio.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    @Override
    Optional<Todo> findById(Long aLong);
    List<Todo> findByUser(User user);

}
