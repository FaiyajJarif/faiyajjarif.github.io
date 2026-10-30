package dev.faiyajjarif.portfolio.project;

import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProjectRequest(
    @NotBlank @Size(max = 120) String title,
    @NotBlank @Size(max = 1000) String summary,
    @NotNull ProjectCategory category,
    @Size(max = 12) List<@Size(max = 40) String> tags,
    @Size(max = 6) List<@Size(max = 160) String> highlights,
    @Size(max = 200) String awardText,
    @Min(0) @Max(50) int awardCount,
    @Size(max = 300) @Pattern(regexp = "^$|^https?://.*", message = "must start with http:// or https://") String repoUrl,
    @Size(max = 300) @Pattern(regexp = "^$|^https?://.*", message = "must start with http:// or https://") String liveUrl,
    boolean featured,
    int sortOrder
) {}
