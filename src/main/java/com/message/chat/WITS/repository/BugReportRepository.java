package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.BugReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugReportRepository extends MongoRepository<BugReport, String> {
    List<BugReport> findByReporterUserIdOrderByTimestampDesc(String reporterUserId);

    List<BugReport> findByStatusOrderByTimestampDesc(BugReport.BugStatus status);
}
