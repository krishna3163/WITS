package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiAssistantService {

    // In reality this would call an LLM API like OpenAI or Gemini
    // We mock basic logical rules for demonstration

    // Basic heuristics for spam
    private static final List<Pattern> SPAM_PATTERNS = Arrays.asList(
            Pattern.compile("(?i).*buy now.*"),
            Pattern.compile("(?i).*free money.*"),
            Pattern.compile("(?i).*crypto.*giveaway.*"),
            Pattern.compile("(?i).*click here.*http.*"));

    public boolean isSpam(String content) {
        if (content == null || content.isEmpty())
            return false;

        for (Pattern p : SPAM_PATTERNS) {
            if (p.matcher(content).matches()) {
                log.warn("Spam detected in message content!");
                return true;
            }
        }
        return false;
    }

    public List<String> generateSmartReplies(Message previousMessage) {
        List<String> replies = new ArrayList<>();
        if (previousMessage.getContent() == null)
            return replies;

        String lowerContent = previousMessage.getContent().toLowerCase();

        if (lowerContent.contains("how are you") || lowerContent.contains("whats up")) {
            replies.add("I'm doing well, thanks! How about you?");
            replies.add("All good here!");
            replies.add("Just working on some code \uD83D\uDCBB");
        } else if (lowerContent.contains("where are you")) {
            replies.add("I'm at home.");
            replies.add("I'm at work.");
            replies.add("Shared Location \uD83D\uDCCD");
        } else if (lowerContent.endsWith("?")) {
            replies.add("Yes!");
            replies.add("No.");
            replies.add("I'm not sure, let me check and get back to you.");
        } else {
            replies.add("\uD83D\uDC4D");
            replies.add("Got it.");
            replies.add("Thanks!");
        }

        return replies;
    }

    public String translateMessage(String content, String targetLanguageCode) {
        // Mock translation logic, would call Google Translate API
        log.info("Translating '{}' to language: {}", content, targetLanguageCode);
        return "[Translated to " + targetLanguageCode + "]: " + content;
    }
}
