package dev.faiyajjarif.portfolio.web;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.faiyajjarif.portfolio.project.Project;
import dev.faiyajjarif.portfolio.project.ProjectRepository;
import dev.faiyajjarif.portfolio.skill.Skill;
import dev.faiyajjarif.portfolio.skill.SkillRepository;
import dev.faiyajjarif.portfolio.stats.VisitService;

@RestController
public class PublicController {

    private final ProjectRepository projects;
    private final SkillRepository skills;
    private final VisitService visits;

    public PublicController(ProjectRepository projects, SkillRepository skills, VisitService visits) {
        this.projects = projects;
        this.skills = skills;
        this.visits = visits;
    }

    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of("service", "Faiyaj Jarif portfolio API", "status", "ok");
    }

    @GetMapping("/api/projects")
    public List<Project> projects() {
        return projects.findAllByOrderBySortOrderAscIdAsc();
    }

    @GetMapping("/api/skills")
    public List<Skill> skills() {
        return skills.findAllByOrderBySortOrderAscIdAsc();
    }

    @GetMapping("/api/stats")
    public Map<String, Long> stats() {
        return Map.of(
            "projects", projects.count(),
            "awards", projects.totalAwards(),
            "skills", skills.count(),
            "visitors", visits.current());
    }

    @GetMapping("/api/visits")
    public Map<String, Long> visitCount() {
        return Map.of("visitors", visits.current());
    }

    /** Called once per browser session by the site. */
    @PostMapping("/api/visits")
    public Map<String, Long> recordVisit() {
        return Map.of("visitors", visits.recordVisit());
    }
}
