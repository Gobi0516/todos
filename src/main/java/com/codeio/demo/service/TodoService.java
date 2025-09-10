package com.codeio.demo.service;


import com.codeio.demo.entity.Todo;

import com.codeio.demo.entity.User;
import com.codeio.demo.repository.TodoRepository;
import com.codeio.demo.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {

    private final TodoRepository todoRepo;
    private final UserRepository userRepo;

    public TodoService(TodoRepository todoRepo, UserRepository userRepo) {
        this.todoRepo = todoRepo;
        this.userRepo = userRepo;
    }

    public List<Todo> getTodos(User user) {
        return todoRepo.findByUser(user);
    }

    public Todo addTodo(String title, User user) {
        Todo todo = new Todo();
        todo.setTitle(title);
        todo.setCompleted(false);
        todo.setUser(user);
        return todoRepo.save(todo);
    }

    public Todo updateTodo(Todo todo, User user) {
        todo.setUser(user);
        return todoRepo.save(todo);
    }

    public void deleteTodo(Long id, User user) {
        Todo todo = todoRepo.findById(id).orElseThrow();
        if(todo.getUser().getId().equals(user.getId())) {
            todoRepo.delete(todo);
        }
    }
}
