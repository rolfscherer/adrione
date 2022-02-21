package one.adri.auth_server.config;

import one.adri.auth_server.repository.UserRepository;
import one.adri.auth_server.security.jwt.JwtTokenAuthenticationFilter;
import one.adri.auth_server.security.jwt.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authorization.AuthorizationContext;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    SecurityWebFilterChain springWebFilterChain(ServerHttpSecurity http,
                                                JwtTokenProvider tokenProvider,
                                                ReactiveAuthenticationManager reactiveAuthenticationManager) {
        final String PATH_PUBLIC = "/api/v1/public/**";
        final String PATH_LOGIN = "/api/v1/auth/login";

        return http
                .exceptionHandling()
                .authenticationEntryPoint((swe, e) ->
                        Mono.fromRunnable(() -> swe.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED))
                ).accessDeniedHandler((swe, e) ->
                        Mono.fromRunnable(() -> swe.getResponse().setStatusCode(HttpStatus.FORBIDDEN))
                ).and()
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .authenticationManager(reactiveAuthenticationManager)
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
                .authorizeExchange(it -> it
                        .pathMatchers(HttpMethod.GET, "/").permitAll()
                        .pathMatchers(HttpMethod.GET, "/index.html").permitAll()
                        .pathMatchers(HttpMethod.GET, "/favicon.ico").permitAll()
                        .pathMatchers(HttpMethod.GET, "/static/**").permitAll()
                        .pathMatchers(HttpMethod.GET, PATH_PUBLIC).permitAll()
                        .pathMatchers(HttpMethod.POST, PATH_LOGIN).permitAll()
                        .pathMatchers("/api/v1/user/{user}/**").access(this::currentUserMatchesPath)
                        .anyExchange().authenticated()
                )
                .addFilterAt(new JwtTokenAuthenticationFilter(tokenProvider), SecurityWebFiltersOrder.HTTP_BASIC)
                .build();


    }

    private Mono<AuthorizationDecision> currentUserMatchesPath(Mono<Authentication> authentication,
                                                               AuthorizationContext context) {
        return authentication
                .map(a -> context.getVariables().get("user").equals(a.getName()))
                .map(AuthorizationDecision::new);

    }

    @Bean
    public ReactiveUserDetailsService userDetailsService(UserRepository users) {

        return username -> users.findByUsername(username)
                .map(u -> User
                        .withUsername(u.getUsername()).password(u.getPassword())
                        .authorities(u.getAuthorities().toArray(new String[0]))
                        .accountExpired(!(u.getExpirationDate() == null || u.getExpirationDate().isAfter(LocalDateTime.now())))
                        .credentialsExpired(!(u.getPasswordExpirationDate() == null || u.getPasswordExpirationDate().isAfter(LocalDateTime.now())))
                        .disabled(!u.isActive())
                        .accountLocked(u.isLooked())
                        .build()
                );
    }

    @Bean
    public ReactiveAuthenticationManager reactiveAuthenticationManager(ReactiveUserDetailsService userDetailsService,
                                                                       PasswordEncoder passwordEncoder) {
        var authenticationManager = new UserDetailsRepositoryReactiveAuthenticationManager(userDetailsService);
        authenticationManager.setPasswordEncoder(passwordEncoder);
        return authenticationManager;
    }
}
