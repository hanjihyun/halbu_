package com.halbu.phonebook.model.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserinfoDto {
    private String id;
    private String email;

    @Builder
    public UserinfoDto(String id, String email) {
        this.id = id;
        this.email = email;
    }
}
