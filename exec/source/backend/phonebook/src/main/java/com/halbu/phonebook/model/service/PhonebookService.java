package com.halbu.phonebook.model.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.halbu.phonebook.model.dto.PhonebookDto;
import com.halbu.phonebook.model.entity.PhonebookEntity;
import com.halbu.phonebook.model.entity.UidTitlePK;
import com.halbu.phonebook.model.repository.PhonebookRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PhonebookService {
	private PhonebookRepository phonebookRepository;

	public PhonebookDto select(String uid, String title) {
		UidTitlePK pk = new UidTitlePK();
		pk.setUid(uid);
		pk.setTitle(title);
		Optional<PhonebookEntity> opt = phonebookRepository.findById(pk);
		if(opt.isPresent()) {
			return opt.get().toDto();
		}
		return null;
	}

	public List<PhonebookDto> selectTexts(String uid) {
		List<PhonebookDto> result = new ArrayList<>();
		for(PhonebookEntity pbe : phonebookRepository.selectTexts(uid)) {
			result.add(pbe.toDto());
		}
		return result;
	}
	
    public void insert(PhonebookDto phonebookDto) {
    	phonebookRepository.save(phonebookDto.toEntity());
    }
    
    public void updateText(PhonebookDto phonebookDto) {
		UidTitlePK pk = new UidTitlePK();
		pk.setUid(phonebookDto.getUid());
		pk.setTitle(phonebookDto.getTitle());
		Optional<PhonebookEntity> opt = phonebookRepository.findById(pk);
		if(opt.isPresent()) {
			PhonebookDto oldData = opt.get().toDto();
			phonebookDto.setFilePath(oldData.getFilePath());
			phonebookDto.setFavorite(oldData.getFavorite());
		}
    	phonebookRepository.save(phonebookDto.toEntity());
    }
    
    public void updatePic(PhonebookDto phonebookDto, String oldtitle) {
    	UidTitlePK pk = new UidTitlePK();
    	pk.setUid(phonebookDto.getUid());
    	pk.setTitle(oldtitle);
		Optional<PhonebookEntity> opt = phonebookRepository.findById(pk);
		if(opt.isPresent()) {
			PhonebookDto olddto = opt.get().toDto();
			phonebookDto.setName(olddto.getName());
			phonebookDto.setMobile(olddto.getMobile());
		}
    	phonebookRepository.deleteById(pk);
    	phonebookRepository.save(phonebookDto.toEntity());
    }
    
    public void delete(String uid, String title) {
    	UidTitlePK pk = new UidTitlePK();
    	pk.setUid(uid);
    	pk.setTitle(title);
    	phonebookRepository.deleteById(pk);
    }
    
    public void favoriteOnOff(String uid, String title) {
    	UidTitlePK pk = new UidTitlePK();
    	pk.setUid(uid);
    	pk.setTitle(title);
		Optional<PhonebookEntity> opt = phonebookRepository.findById(pk);
		if(opt.isPresent()) {
			PhonebookDto pbd = opt.get().toDto();
			if("0".equals(pbd.getFavorite())) {
				pbd.setFavorite("1");
			}
			else {				
				pbd.setFavorite("0");
			}
			phonebookRepository.save(pbd.toEntity());
		}
    }
    
}
