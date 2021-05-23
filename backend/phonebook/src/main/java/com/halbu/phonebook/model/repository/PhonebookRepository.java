package com.halbu.phonebook.model.repository;


import java.util.List;

import javax.persistence.NamedQuery;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.halbu.phonebook.model.dto.PhonebookDto;
import com.halbu.phonebook.model.entity.PhonebookEntity;
import com.halbu.phonebook.model.entity.UidTitlePK;


@Repository
public interface PhonebookRepository extends JpaRepository<PhonebookEntity, UidTitlePK> {

	@Query(value = "SELECT * FROM phonebook AS pb WHERE pb.uid= ?1 ORDER BY FIELD(favorite, 1, 0), name", nativeQuery = true)
	public List<PhonebookEntity> selectTexts(String uid);
}
