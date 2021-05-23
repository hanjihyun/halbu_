package com.halbu.user.model.entity;


import javax.persistence.*;

import com.halbu.user.model.dto.UserinfoDto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Table(name = "userinfo")
public class UserinfoEntity {
    
	@Id
    @Column(nullable = false)
    private String uid;
	
	@Column(columnDefinition = "char(50)")
	private String email;

    @Column(columnDefinition = "char(50)")
    private String mobile;
    
    @Column(columnDefinition = "char(50)")
    private String emergencyMobile;

    @Builder
    public UserinfoEntity(String uid, String email, String mobile, String emergencyMobile) {
        this.uid = uid;
        this.email = email;
        this.mobile = mobile;
        this.emergencyMobile = emergencyMobile;
    }
    
    public UserinfoDto toDto(){
    	UserinfoDto build = UserinfoDto.builder()
                .uid(uid)
                .email(email)
                .mobile(mobile)
                .emergencyMobile(emergencyMobile)
                .build();
        return build;
    }
}
