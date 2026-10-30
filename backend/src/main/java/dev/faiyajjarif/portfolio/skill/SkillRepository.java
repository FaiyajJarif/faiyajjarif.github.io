package dev.faiyajjarif.portfolio.skill;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findAllByOrderBySortOrderAscIdAsc();
}
