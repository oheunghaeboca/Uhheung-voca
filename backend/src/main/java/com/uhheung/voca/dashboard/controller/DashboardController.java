package com.uhheung.voca.dashboard.controller;

import com.uhheung.voca.dashboard.dto.AttendanceDayResponse;
import com.uhheung.voca.dashboard.dto.DashboardSummaryResponse;
import com.uhheung.voca.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardSummaryResponse> getSummary(@RequestParam Long userId) {
        return ResponseEntity.ok(dashboardService.summary(userId));
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceDayResponse>> getAttendance(
            @RequestParam Long userId,
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(dashboardService.attendance(userId, year, month));
    }
}