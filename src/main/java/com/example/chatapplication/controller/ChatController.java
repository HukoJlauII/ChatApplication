package com.example.chatapplication.controller;

import com.example.chatapplication.entity.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public Message sendMessage(@Payload Message message) {
        System.out.println("SERVER: message from "+message.getUser()+": '"+message.getText() +"'");
        return message;
    }

    @MessageMapping("/chat.newUser")
    @SendTo("/topic/public")
    public Message addUser(@Payload Message message,
                               SimpMessageHeaderAccessor headerAccessor) {
        System.out.println("SERVER: user "+message.getUser()+" connected");
        headerAccessor.getSessionAttributes().put("username", message.getUser());
        return message;
    }
}
