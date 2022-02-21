package one.adri.auth_server.repository;

import one.adri.auth_server.domain.Authority;
import one.adri.auth_server.domain.User;
import one.adri.auth_server.model.Profile;
import org.springframework.data.r2dbc.convert.R2dbcConverter;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.concurrent.atomic.AtomicReference;

import static org.springframework.data.relational.core.query.Criteria.where;
import static org.springframework.data.relational.core.query.Query.query;

public class CustomUserRepositoryImpl implements CustomUserRepository {

    private final R2dbcEntityTemplate template;
    private final R2dbcConverter converter;

    public CustomUserRepositoryImpl(R2dbcEntityTemplate template, R2dbcConverter converter) {
        this.template = template;
        this.converter = converter;
    }

    private Flux<Authority> getAuthoritiesByUserId(long id) {
        String query = "select a.* from authority a join user_authority u on (u.authority_id = a.id) where u.user_id = :userId";
        return template.getDatabaseClient().sql(query)
                .bind("userId", id)
                .map( (row, metadata ) -> converter.read(Authority.class, row, metadata))
                .all();

    }

    @Override
    public Mono<User> findByUsername(String username) {

        AtomicReference<User> user = new AtomicReference<>();
        template.selectOne(query(where("username").is(username)), User.class)
                .subscribe(u -> {
                    getAuthoritiesByUserId(u.getId()).subscribe( a -> u.getAuthorities().add(a.getAuthority()));
                    user.set(u);
                });

        return Mono.justOrEmpty(user.get());
    }

    @Override
    public Mono<Profile> findProfileByUsername(String username) {
        String query = "select id, username, firstname, lastname, alias, email, password_expiration_date from user where username = :username";
        return template.getDatabaseClient().sql(query)
                .bind("username", username)
                .map( (row, metadata ) -> converter.read(Profile.class, row, metadata))
                .one();

    }
}
