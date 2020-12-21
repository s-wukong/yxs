package cn.com.cig.cigrsbackend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

@ComponentScan(basePackages = {"cn.com.cig.cigrsbackend.*","cn.hutool.extra.spring"})
@MapperScan(basePackages = {"cn.com.cig.cigrsbackend.dao"})
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableScheduling
@SpringBootApplication(exclude={DataSourceAutoConfiguration.class})
public class CigRsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CigRsBackendApplication.class, args);
	}

}
