package com.halbu.user.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.halbu.user.model.entity.UserinfoEntity;



@Repository
public interface UserinfoRepository extends JpaRepository<UserinfoEntity, String> {

}
