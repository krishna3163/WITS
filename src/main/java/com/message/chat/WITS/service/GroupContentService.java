package com.message.chat.WITS.service;

import com.message.chat.WITS.model.*;
import com.message.chat.WITS.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupContentService {
    private final PollRepository pollRepository;
    private final EventRepository eventRepository;
    private final ReminderRepository reminderRepository;
    private final ChatGroupRepository groupRepository;
    private final GroupActionRequestRepository requestRepository;

    public void createPoll(String groupId, String userId, String question, List<String> options) {
        if (hasPermission(groupId, userId, "CREATE_POLL")) {
            Poll poll = Poll.builder()
                    .groupId(groupId)
                    .creatorId(userId)
                    .question(question)
                    .options(options)
                    .createdAt(LocalDateTime.now())
                    .build();
            pollRepository.save(poll);
        }
    }

    public void createEvent(String groupId, String userId, String title, LocalDateTime time) {
        if (hasPermission(groupId, userId, "CREATE_EVENT")) {
            Event event = Event.builder()
                    .groupId(groupId)
                    .creatorId(userId)
                    .title(title)
                    .eventTime(time)
                    .build();
            eventRepository.save(event);
        }
    }

    public void createReminder(String groupId, String userId, String task, LocalDateTime reminderTime) {
        if (hasPermission(groupId, userId, "CREATE_REMINDER")) {
            Reminder reminder = Reminder.builder()
                    .groupId(groupId)
                    .creatorId(userId)
                    .task(task)
                    .reminderTime(reminderTime)
                    .build();
            reminderRepository.save(reminder);
        }
    }

    public void updatePoll(String pollId, String question, List<String> options) {
        pollRepository.findById(pollId).ifPresent(poll -> {
            poll.setQuestion(question);
            poll.setOptions(options);
            pollRepository.save(poll);
        });
    }

    public void deletePoll(String pollId) {
        pollRepository.deleteById(pollId);
    }

    public void updateEvent(String eventId, String title, String description, LocalDateTime startTime,
            LocalDateTime endTime) {
        eventRepository.findById(eventId).ifPresent(event -> {
            event.setTitle(title);
            event.setDescription(description);
            event.setStartTime(startTime);
            event.setEndTime(endTime);
            eventRepository.save(event);
        });
    }

    public void deleteEvent(String eventId) {
        eventRepository.deleteById(eventId);
    }

    public void updateReminder(String reminderId, String task, LocalDateTime reminderTime) {
        reminderRepository.findById(reminderId).ifPresent(reminder -> {
            reminder.setTask(task);
            reminder.setReminderTime(reminderTime);
            reminderRepository.save(reminder);
        });
    }

    public void deleteReminder(String reminderId) {
        reminderRepository.deleteById(reminderId);
    }

    public void requestAction(String groupId, String userId, String actionType, String details) {
        GroupActionRequest request = GroupActionRequest.builder()
                .groupId(groupId)
                .requesterId(userId)
                .actionType(actionType)
                .details(details)
                .status(GroupActionRequest.RequestStatus.PENDING)
                .timestamp(LocalDateTime.now())
                .build();
        requestRepository.save(request);
    }

    private boolean hasPermission(String groupId, String userId, String action) {
        ChatGroup group = groupRepository.findById(groupId).orElse(null);
        if (group == null)
            return false;
        GroupRole role = group.getMembers().get(userId);
        if (role == null)
            return false;

        return switch (action) {
            case "CREATE_POLL", "CREATE_EVENT" ->
                role == GroupRole.ADMIN || role == GroupRole.SUBADMIN || role == GroupRole.SUBSUBADMIN;
            case "CREATE_REMINDER" ->
                role == GroupRole.ADMIN || role == GroupRole.SUBADMIN;
            default -> false;
        };
    }

    public List<GroupActionRequest> getPendingRequests(String groupId, String userId) {
        ChatGroup group = groupRepository.findById(groupId).orElse(null);
        if (group == null)
            return List.of();
        GroupRole role = group.getMembers().get(userId);
        // Only Admin, Subadmin, Subsubadmin can see requests
        if (role == GroupRole.ADMIN || role == GroupRole.SUBADMIN || role == GroupRole.SUBSUBADMIN) {
            return requestRepository.findByGroupIdAndStatus(groupId, GroupActionRequest.RequestStatus.PENDING);
        }
        return List.of();
    }
}
