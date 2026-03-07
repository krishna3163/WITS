package com.message.chat.WITS.service;

import com.message.chat.WITS.model.BugReport;
import com.message.chat.WITS.model.User;
import com.message.chat.WITS.repository.BugReportRepository;
import com.message.chat.WITS.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeveloperService {

    private final BugReportRepository bugReportRepository;
    private final UserRepository userRepository;

    // Hardcoded Developer Info for the app configuration
    public static final String DEVELOPER_NAME = "Krishna Kumar";
    public static final String DEVELOPER_EMAIL = "kk3163019@gmail.com";

    /**
     * Finds or creates the default Developer Profile in the system
     * so that users can message this particular user.
     */
    public User getDeveloperProfile() {
        Optional<User> devUser = userRepository.findByEmail(DEVELOPER_EMAIL);
        if (devUser.isPresent()) {
            return devUser.get();
        } else {
            // Automatically seed the developer profile if it doesn't exist
            User dev = User.builder()
                    .fullName(DEVELOPER_NAME)
                    .email(DEVELOPER_EMAIL)
                    .username("krishnakumar_dev")
                    .bio("Hey! I'm the developer of WITS. Report bugs to me or chat!")
                    .roles(java.util.Set.of("ROLE_USER", "ROLE_ADMIN", "ROLE_DEVELOPER"))
                    .build();
            return userRepository.save(dev);
        }
    }

    public BugReport reportBug(String reporterUserId, String title, String description, List<String> screenshotUrls) {
        User developer = getDeveloperProfile();

        BugReport report = BugReport.builder()
                .reporterUserId(reporterUserId)
                .developerId(developer.getId())
                .title(title)
                .description(description)
                .screenshotUrls(screenshotUrls != null ? screenshotUrls : new java.util.ArrayList<>())
                .status(BugReport.BugStatus.OPEN)
                .timestamp(LocalDateTime.now())
                .build();

        return bugReportRepository.save(report);
    }

    public List<BugReport> getUserBugReports(String userId) {
        return bugReportRepository.findByReporterUserIdOrderByTimestampDesc(userId);
    }

    public List<BugReport> getOpenBugs() {
        return bugReportRepository.findByStatusOrderByTimestampDesc(BugReport.BugStatus.OPEN);
    }

    public BugReport updateBugStatus(String bugId, BugReport.BugStatus status) {
        return bugReportRepository.findById(bugId).map(bug -> {
            bug.setStatus(status);
            return bugReportRepository.save(bug);
        }).orElseThrow(() -> new RuntimeException("Bug report not found"));
    }
}
