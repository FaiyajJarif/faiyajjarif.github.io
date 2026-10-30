package dev.faiyajjarif.portfolio.web;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import dev.faiyajjarif.portfolio.contact.Message;
import dev.faiyajjarif.portfolio.contact.MessageRepository;
import dev.faiyajjarif.portfolio.project.Project;
import dev.faiyajjarif.portfolio.project.ProjectRepository;
import dev.faiyajjarif.portfolio.project.ProjectRequest;
import dev.faiyajjarif.portfolio.skill.Skill;
import dev.faiyajjarif.portfolio.skill.SkillRepository;
import dev.faiyajjarif.portfolio.skill.SkillRequest;
import jakarta.validation.Valid;

/** Everything under /api/admin requires the admin login (HTTP Basic). */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProjectRepository projects;
    private final SkillRepository skills;
    private final MessageRepository messages;

    public AdminController(ProjectRepository projects, SkillRepository skills, MessageRepository messages) {
        this.projects = projects;
        this.skills = skills;
        this.messages = messages;
    }

    @GetMapping("/me")
    public Map<String, String> me(Principal principal) {
        return Map.of("username", principal.getName());
    }

    // ---- projects ----

    @PostMapping("/projects")
    @Transactional
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projects.save(Project.from(req)));
    }

    @PutMapping("/projects/{id}")
    @Transactional
    public Project updateProject(@PathVariable Long id, @Valid @RequestBody ProjectRequest req) {
        var project = projects.findById(id).orElseThrow(() -> notFound("Project"));
        project.apply(req);
        return projects.save(project);
    }

    @DeleteMapping("/projects/{id}")
    @Transactional
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (!projects.existsById(id)) throw notFound("Project");
        projects.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---- skills ----

    @PostMapping("/skills")
    @Transactional
    public ResponseEntity<Skill> createSkill(@Valid @RequestBody SkillRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(skills.save(Skill.from(req)));
    }

    @PutMapping("/skills/{id}")
    @Transactional
    public Skill updateSkill(@PathVariable Long id, @Valid @RequestBody SkillRequest req) {
        var skill = skills.findById(id).orElseThrow(() -> notFound("Skill"));
        skill.apply(req);
        return skills.save(skill);
    }

    @DeleteMapping("/skills/{id}")
    @Transactional
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        if (!skills.existsById(id)) throw notFound("Skill");
        skills.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---- messages ----

    @GetMapping("/messages")
    public List<Message> messages() {
        return messages.findAllByOrderByCreatedAtDesc();
    }

    @PatchMapping("/messages/{id}/read")
    @Transactional
    public Message markRead(@PathVariable Long id) {
        var message = messages.findById(id).orElseThrow(() -> notFound("Message"));
        message.markRead();
        return messages.save(message);
    }

    @DeleteMapping("/messages/{id}")
    @Transactional
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        if (!messages.existsById(id)) throw notFound("Message");
        messages.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private static ResponseStatusException notFound(String what) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, what + " not found");
    }
}
