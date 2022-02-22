package one.adri.auth_server.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.*;
import org.springframework.data.relational.core.mapping.Table;

import javax.validation.constraints.Email;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table
public class User {

    @Id
    private Long id;

    private String username;

    @JsonIgnore
    private String password;

    private String firstname;

    private String lastname;

    private String alias;

    @Email
    private String email;

    @Builder.Default()
    private boolean active = true;

    @Builder.Default()
    private boolean looked = false;

    private LocalDateTime passwordExpirationDate;

    private LocalDateTime expirationDate;

    private String activationKey;

    private String resetKey;

    private LocalDateTime resetDate;

    @Builder.Default()
    @Transient
    private List<String> authorities = new ArrayList<>();

    @Version
    @JsonIgnore
    private Long version;

    @CreatedDate
    private LocalDateTime createdAt;

    @CreatedBy
    private String createdBy;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @LastModifiedBy
    private String updatedBy;
}
