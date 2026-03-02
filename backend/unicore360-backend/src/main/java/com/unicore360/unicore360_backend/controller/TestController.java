package com.unicore360.unicore360_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "✅ UniCore 360 API is working!";
    }

    @GetMapping("/hello")
    public String hello() {
        return "👋 Welcome to UniCore 360!";
    }

    @GetMapping("/public")
    public String publicTest() {
        return "Public endpoint - no login needed!";
    }
}