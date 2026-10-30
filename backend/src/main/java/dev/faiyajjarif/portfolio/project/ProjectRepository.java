package dev.faiyajjarif.portfolio.project;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByOrderBySortOrderAscIdAsc();

    @Query("select coalesce(sum(p.awardCount), 0L) from Project p")
    long totalAwards();
}
