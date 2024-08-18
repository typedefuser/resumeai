package com.backend.resumeai.websoc.controller;

import com.backend.resumeai.websoc.services.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;

@Controller
public class WebChatController {

    private final ChatService chatService;

    @Autowired
    public WebChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat") // This maps the "/chat" endpoint
    @SendTo("/topic/messages") // Messages will be sent to the "/topic/messages" topic
    public String handleMessage(String message) {
        // Forward message to the ChatService for processing
        return chatService.handleMessage(message);
    }
}
