package one.adri.auth_server.controller;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DefaultDataBufferFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebExceptionHandler;
import reactor.core.publisher.Mono;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

// see: https://stackoverflow.com/questions/47631243/spring-5-reactive-webexceptionhandler-is-not-getting-called
// and https://docs.spring.io/spring-boot/docs/2.0.0.M7/reference/html/boot-features-developing-web-applications.html#boot-features-webflux-error-handling
// and https://stackoverflow.com/questions/48047645/how-to-write-messages-to-http-body-in-spring-webflux-webexceptionhandlder/48057896#48057896
@Component
@Order(-2)
@Slf4j
@RequiredArgsConstructor
public class RestExceptionHandler implements WebExceptionHandler {

    private final ObjectMapper objectMapper;

    private Mono<Void> handleErrors(ServerWebExchange exchange, Errors errors) {
        log.debug("handled errors:" + errors);
        try {
            exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

            var db = new DefaultDataBufferFactory().wrap(objectMapper.writeValueAsBytes(errors));

            // write the given data buffer to the response
            // and return a Mono that signals when it's done
            return exchange.getResponse().writeWith(Mono.just(db));

        } catch (JsonProcessingException e) {
            exchange.getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
            return exchange.getResponse().setComplete();
        }

    }

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        if (ex instanceof WebExchangeBindException) {
            var webExchangeBindException = (WebExchangeBindException) ex;

            log.debug("errors:" + webExchangeBindException.getFieldErrors());
            var errors = new Errors("validation_failure", "Validation failed.");
            webExchangeBindException.getFieldErrors().forEach(e -> errors.add(e.getField(), e.getCode(), e.getDefaultMessage()));
            exchange.getResponse().setStatusCode(HttpStatus.UNPROCESSABLE_ENTITY);

            return handleErrors(exchange, errors);
        } else if (ex instanceof BadCredentialsException) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            var errors = new Errors("bad_credential", "Bad credentials");
            errors.add(exchange.getRequest().getPath().toString(), HttpStatus.UNAUTHORIZED.name(), "Invalid username or password");
            return handleErrors(exchange, errors);
        }
        return Mono.error(ex);
    }

}

@Getter
@ToString
class Errors implements Serializable {

    private final String code;

    private final String message;

    private final List<Error> errors = new ArrayList<>();

    @JsonCreator
    Errors(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public void add(String path, String code, String message) {
        this.errors.add(new Error(path, code, message));
    }

}

@Getter
@ToString
class Error implements Serializable {

    private final String path;

    private final String code;

    private final String message;

    @JsonCreator
    Error(String path, String code, String message) {
        this.path = path;
        this.code = code;
        this.message = message;
    }

}
