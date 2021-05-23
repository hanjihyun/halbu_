package com.halbu.phonebook.model.entity;

import java.io.Serializable;

import lombok.Data;

@Data
public class UidTitlePK implements Serializable {
	private String uid;
	private String title;
}