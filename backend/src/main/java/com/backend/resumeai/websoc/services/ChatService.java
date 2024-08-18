package com.backend.resumeai.websoc.services;

import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final OpenAiChatModel chatModel;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatService(OpenAiChatModel chatModel, SimpMessagingTemplate messagingTemplate) {
        this.chatModel = chatModel;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public String handleMessage(String message) {
        if (message.startsWith("generate:")) {
            String query = message.substring(9).trim();
            return processGenerationRequest(query);
        } else if (message.startsWith("generateStream:")) {
            String query = message.substring(15).trim();
            processGenerationStreamRequest(query);
            return "Stream processing started";
        } else {
            return "{\"type\":\"error\",\"content\":\"Unknown message type: " + message + "\"}";
        }
    }

    private String processGenerationRequest(String query) {
        String response = chatModel.call(query);
        return "generation:" + response;
    }

    private void processGenerationStreamRequest(String query) {
        Prompt prompt = new Prompt(new UserMessage(query));
        chatModel.stream(prompt).subscribe(
                chatResponse -> messagingTemplate.convertAndSend("/topic/messages", "streamResponse:" + chatResponse.toString()),
                error -> messagingTemplate.convertAndSend("/topic/messages", "error:" + error.getMessage()),
                () -> messagingTemplate.convertAndSend("/topic/messages", "streamComplete")
        );
    }
}