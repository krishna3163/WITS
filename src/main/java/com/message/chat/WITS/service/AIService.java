package com.message.chat.WITS.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIService {

    public String askAssistant(String question) {
        // In a real app, this would call GPT-4, Claude, or a local LLM API
        if (question.toLowerCase().contains("weather")) {
            return "The AI assistant says: It's always sunny in the WITS app!";
        } else if (question.toLowerCase().contains("help")) {
            return "The AI assistant says: You can send messages, make calls, and share media here.";
        } else {
            return "The AI assistant says: That's a great question about '" + question
                    + "'. I'm here to help you build your social network!";
        }
    }
}
