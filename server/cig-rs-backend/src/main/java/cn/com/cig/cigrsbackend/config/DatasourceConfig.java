package cn.com.cig.cigrsbackend.config;

import java.sql.SQLException;
import javax.sql.DataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import com.alibaba.druid.pool.DruidDataSource;

@Configuration
public class DatasourceConfig {

    @Value("${ds1.datasource.url}")
    private String url;
    @Value("${ds1.datasource.username}")
    private String user;
    @Value("${ds1.datasource.password}")
    private String password;
    @Value("${ds1.datasource.driverClassName}")
    private String driverClass;

    @Value("${ds1.datasource.maxActive}")
    private Integer maxActive;
    @Value("${ds1.datasource.minIdle}")
    private Integer minIdle;
    @Value("${ds1.datasource.initialSize}")
    private Integer initialSize;
    @Value("${ds1.datasource.maxWait}")
    private Long maxWait;
    @Value("${ds1.datasource.timeBetweenEvictionRunsMillis}")
    private Long timeBetweenEvictionRunsMillis;
    @Value("${ds1.datasource.minEvictableIdleTimeMillis}")
    private Long minEvictableIdleTimeMillis;
    @Value("${ds1.datasource.testWhileIdle}")
    private Boolean testWhileIdle;
    @Value("${ds1.datasource.testWhileIdle}")
    private Boolean testOnBorrow;
    @Value("${ds1.datasource.testOnBorrow}")
    private Boolean testOnReturn;

    @Bean(name = "dataSource")
    @Primary
    public DataSource dataSource() {
        //jdbc配置
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setDriverClassName(driverClass);
        dataSource.setUrl(url);
        dataSource.setUsername(user);
        dataSource.setPassword(password);

        //连接池配置
        dataSource.setMaxActive(maxActive);
        dataSource.setMinIdle(minIdle);
        dataSource.setInitialSize(initialSize);
        dataSource.setMaxWait(maxWait);
        dataSource.setTimeBetweenEvictionRunsMillis(timeBetweenEvictionRunsMillis);
        dataSource.setMinEvictableIdleTimeMillis(minEvictableIdleTimeMillis);
        dataSource.setTestWhileIdle(testWhileIdle);
        dataSource.setTestOnBorrow(testOnBorrow);
        dataSource.setTestOnReturn(testOnReturn);
        dataSource.setValidationQuery("SELECT 'x'");

        dataSource.setPoolPreparedStatements(true);
        dataSource.setMaxPoolPreparedStatementPerConnectionSize(20);

        try {
            dataSource.setFilters("stat");
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return dataSource;
    }

    @Bean(name = "transactionManager")
    @Primary
    public DataSourceTransactionManager transactionManager() {
        return new DataSourceTransactionManager(dataSource());
    }

    @Bean(name = "mybatisConfig")
    @ConfigurationProperties(prefix = "mybatis.configuration")
    public org.apache.ibatis.session.Configuration configuration(){
        return new org.apache.ibatis.session.Configuration();
    }

    @Bean(name = "sqlSessionFactory")
    @Primary
    public SqlSessionFactory ds1SqlSessionFactory(@Qualifier("dataSource") DataSource dataSource,@Qualifier("mybatisConfig") org.apache.ibatis.session.Configuration configuration)
            throws Exception {
        final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
        sessionFactory.setConfiguration(configuration);
        return sessionFactory.getObject();
    }
}