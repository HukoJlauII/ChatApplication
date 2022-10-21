package com.example.chatapplication.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
    @GetMapping("/webs")
    public String showIndex() {
        return "index";
    }
}
