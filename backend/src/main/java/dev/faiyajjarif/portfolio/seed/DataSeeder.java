package dev.faiyajjarif.portfolio.seed;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import dev.faiyajjarif.portfolio.project.Project;
import dev.faiyajjarif.portfolio.project.ProjectCategory;
import dev.faiyajjarif.portfolio.project.ProjectRepository;
import dev.faiyajjarif.portfolio.project.ProjectRequest;
import dev.faiyajjarif.portfolio.skill.Skill;
import dev.faiyajjarif.portfolio.skill.SkillRepository;

/**
 * Fills an empty database with starter content (from github.com/faiyajjarif). After the first run,
 * edit everything from the admin panel - this only runs while the tables are empty.
 * Keep it in sync with frontend/src/data/fallback.js (what the site shows while the API wakes up).
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final ProjectRepository projects;
    private final SkillRepository skills;

    public DataSeeder(ProjectRepository projects, SkillRepository skills) {
        this.projects = projects;
        this.skills = skills;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (projects.count() == 0) {
            projects.saveAll(List.of(
                project("Cha Ghor",
                    "Tea garden management system with plot tracking, analytics and AI-based leaf analysis.",
                    ProjectCategory.WEB, List.of("Spring Boot", "PostgreSQL", "React", "FastAPI", "Figma"),
                    List.of("Map-based tracking of tea garden plots", "Analytics dashboards for garden operations",
                        "FastAPI service that analyses tea-leaf images", "UI designed in Figma"),
                    "2nd Runner-Up, UIU CSE Project Show, System Analysis & Design Lab (2026)", 1,
                    "https://github.com/faiyajjarif/Cha-Ghor", 1),
                project("PawHome",
                    "Pet adoption and boarding platform where the database itself enforces the business rules.",
                    ProjectCategory.WEB, List.of("Spring Boot", "MySQL", "Flyway", "React", "Tailwind"),
                    List.of("32 tables, 69 foreign keys, 39 CHECK constraints", "Business rules enforced at the schema level",
                        "Versioned schema migrations with Flyway"),
                    null, 0, "https://github.com/PawHome-UIU", 2),
                project("RescueBot",
                    "Autonomous search-and-rescue robot for locating people trapped in disaster zones.",
                    ProjectCategory.ROBOTICS, List.of("Microprocessors", "ESP32", "Python", "OpenCV"),
                    List.of("Built to enter collapsed buildings and cross rough terrain",
                        "On-board computer vision with Python and OpenCV", "Microprocessor control with a four-wheel all-terrain chassis"),
                    "2nd Runner-Up, SMUCT CSE Fest v3.0 · 3rd Runner-Up, UIU CSE Project Show, Electronics Lab (2026)", 2,
                    null, 3),
                project("Hishab-Nikash",
                    "Personal and family finance tracker with real-time updates.",
                    ProjectCategory.WEB, List.of("Spring Boot", "PostgreSQL", "React", "WebSocket"),
                    List.of("Real-time updates over WebSocket", "QR code scanning", "PDF report generation"),
                    null, 0, "https://github.com/faiyajjarif/Hishab-Nikash", 4),
                project("DatabaseHub",
                    "E-learning platform backend API covering courses, assessments, payments and gamification.",
                    ProjectCategory.WEB, List.of("ASP.NET Core 8", "PostgreSQL", "EF Core"),
                    List.of("Role-based access control", "Courses, assessments and payments", "Gamification layer for learners"),
                    "2nd Runner-Up, UIU CSE Project Show, Database Management Systems Lab (2025)", 1,
                    "https://github.com/faiyajjarif/DatabaseHub", 5)));
        }

        if (skills.count() == 0) {
            var order = new int[] {0};
            List<Skill> seed = new ArrayList<>();
            addAll(seed, order, "Full Stack", "Spring Boot", "React", "ASP.NET Core", "FastAPI", "REST APIs", "JWT");
            addAll(seed, order, "Languages", "Java", "C", "C++", "C#", "Python", "JavaScript");
            addAll(seed, order, "Frontend & Design", "Vite", "Tailwind CSS", "HTML5", "CSS3", "Figma");
            addAll(seed, order, "Databases & DevOps", "PostgreSQL", "MySQL", "Flyway", "Docker");
            addAll(seed, order, "Robotics, IoT & Vision", "Microprocessors", "ESP32", "Arduino", "OpenCV", "YOLO");
            addAll(seed, order, "Tools", "Git", "VS Code", "IntelliJ IDEA", "Linux");
            skills.saveAll(seed);
        }
    }

    private static Project project(String title, String summary, ProjectCategory category, List<String> tags,
                                   List<String> highlights, String awardText, int awardCount, String repoUrl, int order) {
        return Project.from(new ProjectRequest(title, summary, category, tags, highlights, awardText, awardCount,
            repoUrl, null, false, order));
    }

    private static void addAll(List<Skill> into, int[] order, String category, String... names) {
        for (var name : names) {
            into.add(new Skill(name, category, ++order[0]));
        }
    }
}
