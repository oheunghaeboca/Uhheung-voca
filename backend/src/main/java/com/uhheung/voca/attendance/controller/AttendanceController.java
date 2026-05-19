package com.uhheung.voca.attendance.controller;

import com.uhheung.voca.attendance.dto.AttendanceCheckResponse;
import com.uhheung.voca.attendance.dto.AttendanceResponse;
import com.uhheung.voca.attendance.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check")
    public AttendanceCheckResponse check(@RequestParam Long quizResultId) {
        return attendanceService.checkByQuizResult(quizResultId);
    }

    @GetMapping
    public List<AttendanceResponse> monthly(
            @RequestParam Long userId,
            @RequestParam int year,
            @RequestParam int month
    ) {
        return attendanceService.monthly(userId, year, month);
    }
}