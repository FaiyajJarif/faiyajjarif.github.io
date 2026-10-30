package dev.faiyajjarif.portfolio;

import static org.hamcrest.Matchers.greaterThan;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE",
    "app.admin.username=tester",
    "app.admin.password=secret-pass"
})
@AutoConfigureMockMvc
class ApiTest {

    @Autowired MockMvc mvc;

    @Test
    void publicEndpointsServeSeedData() throws Exception {
        mvc.perform(get("/api/projects"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("Cha Ghor"))
            .andExpect(jsonPath("$[0].tags.length()").value(5))
            .andExpect(jsonPath("$[0].highlights.length()").value(4));
        mvc.perform(get("/api/skills")).andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(greaterThan(5)));
        mvc.perform(get("/api/stats")).andExpect(status().isOk())
            .andExpect(jsonPath("$.awards").value(4));
    }

    @Test
    void visitCounterIncrements() throws Exception {
        mvc.perform(post("/api/visits")).andExpect(status().isOk());
        mvc.perform(post("/api/visits")).andExpect(status().isOk())
            .andExpect(jsonPath("$.visitors").value(greaterThan(1)));
    }

    @Test
    void contactValidatesAndSaves() throws Exception {
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"\",\"email\":\"nope\",\"message\":\"hi\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.fields.email").exists());

        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Recruiter\",\"email\":\"r@example.com\",\"message\":\"Loved RescueBot, let's talk!\"}"))
            .andExpect(status().isCreated());

        mvc.perform(get("/api/admin/messages").with(httpBasic("tester", "secret-pass")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("Recruiter"));
    }

    @Test
    void adminRequiresLogin() throws Exception {
        mvc.perform(get("/api/admin/me")).andExpect(status().isUnauthorized())
            .andExpect(header().doesNotExist("WWW-Authenticate"));
        mvc.perform(get("/api/admin/me").with(httpBasic("tester", "wrong"))).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/me").with(httpBasic("tester", "secret-pass")))
            .andExpect(status().isOk()).andExpect(jsonPath("$.username").value("tester"));
    }

    @Test
    void adminCanCreateProject() throws Exception {
        mvc.perform(post("/api/admin/projects").with(httpBasic("tester", "secret-pass"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Test\",\"summary\":\"A test project\",\"category\":\"WEB\",\"tags\":[\"x\"],\"awardCount\":0,\"repoUrl\":\"ftp://bad\"}"))
            .andExpect(status().isBadRequest());
        mvc.perform(post("/api/admin/projects").with(httpBasic("tester", "secret-pass"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Test\",\"summary\":\"A test project\",\"category\":\"WEB\",\"tags\":[\"x\"],\"awardCount\":0,\"sortOrder\":99}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void corsAllowsTheSite() throws Exception {
        mvc.perform(options("/api/admin/me")
                .header("Origin", "https://faiyajjarif.github.io")
                .header("Access-Control-Request-Method", "GET")
                .header("Access-Control-Request-Headers", "authorization"))
            .andExpect(status().isOk())
            .andExpect(header().string("Access-Control-Allow-Origin", "https://faiyajjarif.github.io"));
        mvc.perform(options("/api/projects")
                .header("Origin", "https://evil.example")
                .header("Access-Control-Request-Method", "GET"))
            .andExpect(status().isForbidden());
    }
}
