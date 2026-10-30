package dev.faiyajjarif.portfolio.project;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 1000)
    private String summary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectCategory category;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_tags", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "position")
    @Column(name = "tag", length = 40)
    private List<String> tags = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_highlights", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "position")
    @Column(name = "highlight", length = 160)
    private List<String> highlights = new ArrayList<>();

    @Column(length = 200)
    private String awardText;

    private int awardCount;

    @Column(length = 300)
    private String repoUrl;

    @Column(length = 300)
    private String liveUrl;

    private boolean featured;

    private int sortOrder;

    protected Project() {}

    public static Project from(ProjectRequest r) {
        var p = new Project();
        p.apply(r);
        return p;
    }

    public void apply(ProjectRequest r) {
        this.title = r.title().trim();
        this.summary = r.summary().trim();
        this.category = r.category();
        this.tags = new ArrayList<>(r.tags() == null ? List.of()
            : r.tags().stream().map(String::trim).filter(t -> !t.isEmpty()).toList());
        this.highlights = new ArrayList<>(r.highlights() == null ? List.of()
            : r.highlights().stream().map(String::trim).filter(t -> !t.isEmpty()).toList());
        this.awardText = blankToNull(r.awardText());
        this.awardCount = r.awardCount();
        this.repoUrl = blankToNull(r.repoUrl());
        this.liveUrl = blankToNull(r.liveUrl());
        this.featured = r.featured();
        this.sortOrder = r.sortOrder();
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getSummary() { return summary; }
    public ProjectCategory getCategory() { return category; }
    public List<String> getTags() { return tags; }
    public List<String> getHighlights() { return highlights; }
    public String getAwardText() { return awardText; }
    public int getAwardCount() { return awardCount; }
    public String getRepoUrl() { return repoUrl; }
    public String getLiveUrl() { return liveUrl; }
    public boolean isFeatured() { return featured; }
    public int getSortOrder() { return sortOrder; }
}
