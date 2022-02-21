package one.adri.auth_server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import java.util.List;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;
import static org.springframework.web.reactive.function.server.ServerResponse.ok;

@Configuration
public class WebConfig {
    @Bean
    CorsWebFilter corsWebFilter() {
        var corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of("localhost", "mytrustedwebsite.com"));
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsWebFilter(source);
    }

    @Bean
    public RouterFunction<ServerResponse> htmlRouter(@Value("classpath:/static/index.html") Resource html) {
        return route(GET("/"), request -> ok().contentType(MediaType.TEXT_HTML).bodyValue(html)
        );
    }

    @Bean
    public RouterFunction<ServerResponse> resRouter() {
        return RouterFunctions.resources("/static/**", new ClassPathResource("static/"));
    }
}
