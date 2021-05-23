package com.halbu.user.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.halbu.user.model.dto.UserinfoDto;
import com.halbu.user.model.service.EmergencyService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/emergency")
public class EmergencyController {
	private final Logger logger = LoggerFactory.getLogger(this.getClass().getSimpleName());
	
	private static final String SUCCESS = "success";
	private static final String FAIL = "fail";
	
	private EmergencyService emergencyService;
	
	@GetMapping
	public Object connectionTest(@RequestAttribute UserinfoDto tokendata) {
		logger.info("get - connection test");
		System.out.println(tokendata);
		try {
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
			}}, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/info")
	public Object getEmergencyMobile(@RequestAttribute UserinfoDto tokendata) {
		logger.info("get - get emergency mobile");
		try {
			UserinfoDto resUserinfo = emergencyService.select(tokendata);
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
				put("userinfo", resUserinfo);
			}}, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping("/save")
	public Object saveEmergencyMobile(@RequestAttribute UserinfoDto tokendata, UserinfoDto userinfo) {
		logger.info("post - save emergency mobile");
		try {
			userinfo.setUid(tokendata.getUid());
			userinfo.setEmail(tokendata.getEmail());
			emergencyService.insert(userinfo);
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
			}}, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@DeleteMapping("/remove")
	public Object removeEmergencyMobile(@RequestAttribute UserinfoDto tokendata) {
		logger.info("delete - remove emergency mobile");
		try {
			emergencyService.delete(tokendata);
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
			}}, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
