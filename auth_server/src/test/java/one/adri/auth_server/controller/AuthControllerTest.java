package one.adri.auth_server.controller;

import one.adri.auth_server.model.AuthenticationRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.BodyInserters;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthControllerTest {

    @Autowired
    private WebTestClient client;

    @Test
    void login() {
        var req = AuthenticationRequest.builder().username("admin").password("admin").build();

        var resp = this.client.post()
                .uri("/api/v1/auth/login")
                .body(BodyInserters.fromValue(req))
                .exchange()
                .expectHeader().exists(HttpHeaders.AUTHORIZATION)
                .expectBody()
                .jsonPath("$.token").exists();
    }
}
