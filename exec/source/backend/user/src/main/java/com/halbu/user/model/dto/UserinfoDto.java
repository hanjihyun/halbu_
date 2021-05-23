package com.halbu.user.model.dto;


import com.halbu.user.model.entity.UserinfoEntity;

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
    private String uid;
    private String email;
    private String mobile;
    private String emergencyMobile;

    public UserinfoEntity toEntity(){
    	UserinfoEntity build = UserinfoEntity.builder()
                .uid(uid)
                .email(email)
                .mobile(mobile)
                .emergencyMobile(emergencyMobile)
                .build();
        return build;
    }
    
    @Builder
    public UserinfoDto(String uid, String email, String mobile, String emergencyMobile) {
        this.uid = uid;
        this.email = email;
        this.mobile = mobile;
        this.emergencyMobile = emergencyMobile;
    }
    
    @Builder
    public UserinfoDto(String uid, String email) {
        this.uid = uid;
        this.email = email;
    }
}
