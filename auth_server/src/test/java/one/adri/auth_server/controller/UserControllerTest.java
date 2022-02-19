package one.adri.auth_server.controller;

import one.adri.auth_server.domain.User;
import one.adri.auth_server.model.AuthenticationRequest;
import one.adri.auth_server.model.AuthenticationResponse;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerTest {
    @LocalServerPort
    private int port;

    @Test
    void getProfile() {

        final String USERNAME = "admin";

        var authRequest = AuthenticationRequest.builder().username(USERNAME).password(USERNAME).build();

        WebClient webClient = WebClient.builder()
                .baseUrl("http://localhost:" + port + "/api")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        AuthenticationResponse response = webClient.post()
                .uri("/auth/login")
                .body(Mono.just(authRequest), AuthenticationResponse.class)
                .retrieve()
                .bodyToMono(AuthenticationResponse.class).block();

        assert response != null;
        var user = webClient.get()
                .uri("/user/" + USERNAME)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + response.getToken())
                .retrieve()
                .bodyToMono(User.class)
                .block();
        assertThat(user.getUsername()).isEqualTo(USERNAME);
    }

    @Test
    void getWrongProfile() {

        final String USERNAME = "admin";

        var authRequest = AuthenticationRequest.builder().username(USERNAME).password(USERNAME).build();

        WebClient webClient = WebClient.builder()
                .baseUrl("http://localhost:" + port + "/api")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        AuthenticationResponse response = webClient.post()
                .uri("/auth/login")
                .body(Mono.just(authRequest), AuthenticationResponse.class)
                .retrieve()
                .bodyToMono(AuthenticationResponse.class).block();

        assertThatExceptionOfType(IllegalStateException.class).isThrownBy(() ->
                {
                    assert response != null;
                    webClient.get()
                            .uri("/user/user")
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + response.getToken())
                            .retrieve()
                            .onStatus(HttpStatus.FORBIDDEN::equals, resp -> resp.bodyToMono(String.class).map(IllegalStateException::new))
                            .bodyToMono(User.class)
                            .block();
                }
        ).withMessageContaining("Access Denied");
    }

}
