package one.adri.auth_server.controller;

import lombok.RequiredArgsConstructor;
import one.adri.auth_server.model.AuthenticationRequest;
import one.adri.auth_server.model.AuthenticationResponse;
import one.adri.auth_server.security.jwt.JwtTokenProvider;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtTokenProvider tokenProvider;
    private final ReactiveAuthenticationManager authenticationManager;

    @PostMapping("/login")
    public Mono<ResponseEntity<AuthenticationResponse>> login(@Valid @RequestBody Mono<AuthenticationRequest> authRequest) {

        return authRequest
                .flatMap(login -> this.authenticationManager
                        .authenticate(new UsernamePasswordAuthenticationToken(login.getUsername(), login.getPassword()))
                        .map(this.tokenProvider::createToken)
                )
                .map(jwt -> {
                    HttpHeaders httpHeaders = new HttpHeaders();
                    httpHeaders.add(HttpHeaders.AUTHORIZATION, "Bearer " + jwt);
                    var response = new AuthenticationResponse(jwt);
                    return new ResponseEntity<>(response, httpHeaders, HttpStatus.OK);
                });

    }

    @GetMapping("/refresh_token")
    public Mono<ResponseEntity<AuthenticationResponse>> refreshToken(@AuthenticationPrincipal Mono<UserDetails> principal) {
        return principal.map(this.tokenProvider::createToken)
                .map(jwt -> {
                    HttpHeaders httpHeaders = new HttpHeaders();
                    httpHeaders.add(HttpHeaders.AUTHORIZATION, "Bearer " + jwt);
                    var response = new AuthenticationResponse(jwt);
                    return new ResponseEntity<>(response, httpHeaders, HttpStatus.OK);
                });
    }
}
