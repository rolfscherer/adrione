package one.adri.auth_server.service;

import one.adri.auth_server.domain.Authority;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthorityServiceTest {

    @Autowired
    AuthorityService authorityService;

    @Test
    @WithMockUser("admin")
    void createAuthority() {
        var authority = Authority.builder().authority("ROLE_SYSTEM").description("Internal role for system activity").build();
        var a = authorityService.createAuthority(authority)
                .log().block();

        assertThat(a.getCreatedAt()).isNotNull();
        assertThat(a.getCreatedBy()).isEqualTo("admin");
    }
}
