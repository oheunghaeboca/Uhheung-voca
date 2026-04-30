package com.uhheung.voca.mission.repository;

import com.uhheung.voca.mission.entity.DailyMission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyMissionRepository extends JpaRepository<DailyMission, Long> {

    Optional<DailyMission> findByUserIdAndDate(Long userId, LocalDate date);
}
