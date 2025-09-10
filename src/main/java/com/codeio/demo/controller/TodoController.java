package com.codeio.demo.controller;

import com.codeio.demo.entity.Todo;

import com.codeio.demo.entity.User;
import com.codeio.demo.service.TodoService;
import com.codeio.demo.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/todo")
@CrossOrigin(origins = "http://localhost:3000")
public class TodoController {

    private final TodoService todoService;
    private final UserService userService;

    public TodoController(TodoService todoService, UserService userService) {
        this.todoService = todoService;
        this.userService = userService;
    }

    @GetMapping()
    public List<Todo> getTodos(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername());
        return todoService.getTodos(user);
    }

    @PostMapping()
    public Todo addTodo(@RequestBody Map<String,Object> req, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername());
        return todoService.addTodo((String) req.get("title"), user);
    }

    @PutMapping
    public Todo updateTodo(@RequestBody Todo todo, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername());
        return todoService.updateTodo(todo, user);
    }

    @DeleteMapping("/{id}")
    public Map<String,String> deleteTodo(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername());
        todoService.deleteTodo(id, user);
        return Map.of("message", "Deleted successfully");
    }
}
