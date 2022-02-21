package one.adri.auth_server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    private Long id;

    private String username;

    private String firstname;

    private String lastname;

    private String alias;

    private String email;

    private LocalDateTime passwordExpirationDate;

}
