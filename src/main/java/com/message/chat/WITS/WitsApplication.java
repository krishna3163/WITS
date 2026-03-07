package com.message.chat.WITS;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableScheduling
public class WitsApplication {

	public static void main(String[] args) {
		SpringApplication.run(WitsApplication.class, args);
	}

}
