package dev.faiyajjarif.portfolio.skill;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String name;

    /** Free-form group shown on the site, e.g. "Backend", "Robotics". */
    @Column(nullable = false, length = 40)
    private String category;

    private int sortOrder;

    protected Skill() {}

    public Skill(String name, String category, int sortOrder) {
        this.name = name;
        this.category = category;
        this.sortOrder = sortOrder;
    }

    public static Skill from(SkillRequest r) {
        return new Skill(r.name().trim(), r.category().trim(), r.sortOrder());
    }

    public void apply(SkillRequest r) {
        this.name = r.name().trim();
        this.category = r.category().trim();
        this.sortOrder = r.sortOrder();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public int getSortOrder() { return sortOrder; }
}
