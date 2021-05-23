package com.halbu.phonebook.model.entity;


import javax.persistence.*;

import com.halbu.phonebook.model.dto.PhonebookDto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Table(name = "phonebook")
@IdClass(UidTitlePK.class)
public class PhonebookEntity {
    
	@Id
    @Column(nullable = false)
    private String uid;

	@Id
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "char(50)", nullable = false)
    private String name;

    @Column(columnDefinition = "char(50)", nullable = false)
    private String mobile;
	
    @Column(columnDefinition = "TEXT", nullable = false)
    private String filePath;
    
    @Column(columnDefinition = "char(2)", nullable = false)
    private String favorite;

    @Builder
    public PhonebookEntity(String uid, String title, String name, String mobile, String filePath, String favorite) {
        this.uid = uid;
        this.title = title;
        this.name = name;
        this.mobile = mobile;
        this.filePath = filePath;
        this.favorite = favorite;
    }
    
    public PhonebookDto toDto(){
    	PhonebookDto build = PhonebookDto.builder()
                .uid(uid)
                .title(title)
                .name(name)
                .mobile(mobile)
                .filePath(filePath)
                .favorite(favorite)
                .build();
        return build;
    }
}
