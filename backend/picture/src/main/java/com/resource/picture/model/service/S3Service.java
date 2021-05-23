package com.resource.picture.model.service;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class S3Service {
	private final AmazonS3Client s3Client;

	@Value("${cloud.aws.s3.bucket}")
	private String bucket;
	
	
	public String upload(String uid, MultipartFile multipartFile) throws IOException {
		String fileName = multipartFile.getOriginalFilename();
		byte[] bytes = IOUtils.toByteArray(multipartFile.getInputStream());
		ObjectMetadata metadata = new ObjectMetadata();
		metadata.setContentLength(bytes.length);
		ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);

		s3Client.putObject(new PutObjectRequest(bucket, "static/" + uid + "/" + fileName, byteArrayInputStream, metadata).withCannedAcl(CannedAccessControlList.PublicRead));
		return s3Client.getUrl(bucket, fileName).toString();
	}

	public String change(String uid, String oldtitle, MultipartFile file) throws IOException {
		String fileName = file.getOriginalFilename();
		remove(uid, oldtitle);
		return upload(uid, file);
	}

	public String download(String uid, String title) throws IOException {
		String encodedString = null;
		S3Object s3Object = s3Client.getObject(bucket, "static/" + uid + "/" + title);
		try(S3ObjectInputStream s3InputStream = s3Object.getObjectContent()) {
			byte[] imageByteArr = IOUtils.readFully(s3InputStream, (int) s3Object.getObjectMetadata().getContentLength());
			encodedString = Base64.getEncoder().encodeToString(imageByteArr);
		}
		return encodedString;
	}

	public boolean remove(String uid, String title) throws IOException {
		s3Client.deleteObject(bucket, "static/" + uid + "/" + title);
		return true;
	}
	

}