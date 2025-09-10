package com.codeio.demo.controller;

import com.codeio.demo.config.JwtService;
import com.codeio.demo.entity.User;
import com.codeio.demo.service.UserService;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000") // adjust to your frontend port
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authManager, UserService userService, JwtService jwtService) {
        this.authManager = authManager;
        this.userService = userService;
       this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public Map<String,String> register(@RequestBody Map<String,String> req) {
        User user = new User();
        user.setEmail(req.get("email"));
        user.setPassword(req.get("password"));

        userService.save(user);  // use the existing save method
        return Map.of("message", "User registered successfully");
    }


    @PostMapping("/login")
    public Map<String,String> login(@RequestBody Map<String,String> req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.get("email"), req.get("password"))
        );
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String token = jwtService.generateToken(userDetails);
        return Map.of("token", token);
    }
}

