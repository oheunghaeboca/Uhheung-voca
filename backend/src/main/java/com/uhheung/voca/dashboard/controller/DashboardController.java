package com.uhheung.voca.dashboard.controller;

import com.uhheung.voca.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    // TODO: GET /api/dashboard
    // TODO: GET /api/dashboard/attendance?year=&month=
}
