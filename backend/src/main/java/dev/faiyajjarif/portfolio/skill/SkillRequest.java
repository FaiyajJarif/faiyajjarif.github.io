package dev.faiyajjarif.portfolio.skill;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SkillRequest(
    @NotBlank @Size(max = 60) String name,
    @NotBlank @Size(max = 40) String category,
    int sortOrder
) {}
