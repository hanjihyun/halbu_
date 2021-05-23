package com.halbu.phonebook.model.dto;


import com.halbu.phonebook.model.entity.PhonebookEntity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class PhonebookDto {
    private String uid;
    private String title;
    private String name;
    private String mobile;
    private String filePath;
    private String favorite;

    public PhonebookEntity toEntity(){
    	PhonebookEntity build = PhonebookEntity.builder()
                .uid(uid)
                .title(title)
                .name(name)
                .mobile(mobile)
                .filePath(filePath)
                .favorite(favorite)
                .build();
        return build;
    }

    @Builder
    public PhonebookDto(String uid, String title, String name, String mobile, String filePath, String favorite) {
        this.uid = uid;
        this.title = title;
        this.name = name;
        this.mobile = mobile;
        this.filePath = filePath;
        this.favorite = favorite;
    }
}
