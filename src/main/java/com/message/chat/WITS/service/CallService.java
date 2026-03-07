package com.message.chat.WITS.service;

import com.message.chat.WITS.model.WebRTCSession;
import com.message.chat.WITS.repository.WebRTCSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CallService {

    private final WebRTCSessionRepository sessionRepository;

    public WebRTCSession initiateCall(String callerId, String recipientId, String groupId, WebRTCSession.CallType type,
            String offerSdp) {
        WebRTCSession session = WebRTCSession.builder()
                .initiatorId(callerId)
                .recipientId(recipientId)
                .groupId(groupId)
                .callType(type)
                .status(WebRTCSession.CallStatus.RINGING)
                .offerSdp(offerSdp)
                .startedAt(LocalDateTime.now())
                .build();

        session.getActiveParticipants().add(callerId);
        return sessionRepository.save(session);
    }

    public WebRTCSession answerCall(String sessionId, String answererId, String answerSdp) {
        return sessionRepository.findById(sessionId).map(session -> {
            session.setAnswerSdp(answerSdp);
            session.setStatus(WebRTCSession.CallStatus.ONGOING);
            session.getActiveParticipants().add(answererId);
            return sessionRepository.save(session);
        }).orElseThrow(() -> new RuntimeException("Call session not found"));
    }

    public void rejectCall(String sessionId) {
        sessionRepository.findById(sessionId).ifPresent(session -> {
            session.setStatus(WebRTCSession.CallStatus.REJECTED);
            session.setEndedAt(LocalDateTime.now());
            sessionRepository.save(session);
        });
    }

    public void endCall(String sessionId) {
        sessionRepository.findById(sessionId).ifPresent(session -> {
            session.setStatus(WebRTCSession.CallStatus.COMPLETED);
            session.setEndedAt(LocalDateTime.now());
            sessionRepository.save(session);
        });
    }

    public void addIceCandidate(String sessionId, boolean isCaller, String candidate) {
        sessionRepository.findById(sessionId).ifPresent(session -> {
            if (isCaller) {
                session.getCallerIceCandidates().add(candidate);
            } else {
                session.getCalleeIceCandidates().add(candidate);
            }
            sessionRepository.save(session);
        });
    }

    public Optional<WebRTCSession> getSession(String sessionId) {
        return sessionRepository.findById(sessionId);
    }
}
