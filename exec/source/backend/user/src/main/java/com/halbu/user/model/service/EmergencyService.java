package com.halbu.user.model.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.halbu.user.model.dto.UserinfoDto;
import com.halbu.user.model.entity.UserinfoEntity;
import com.halbu.user.model.repository.UserinfoRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class EmergencyService {
	private UserinfoRepository userinfoRepository;

	public UserinfoDto select(UserinfoDto userinfoDto) {
		Optional<UserinfoEntity> opt = userinfoRepository.findById(userinfoDto.getUid());
		if(!opt.isPresent()) {
			userinfoRepository.save(userinfoDto.toEntity());
			opt = userinfoRepository.findById(userinfoDto.getUid());
		}
		return opt.get().toDto();
	}
	
	public void insert(UserinfoDto userinfoDto) {
		userinfoRepository.save(userinfoDto.toEntity());
	}
	
	public void delete(UserinfoDto userinfoDto) {
		userinfoRepository.deleteById(userinfoDto.getUid());
	}
    
}
