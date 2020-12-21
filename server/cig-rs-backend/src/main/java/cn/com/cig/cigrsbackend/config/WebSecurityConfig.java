package cn.com.cig.cigrsbackend.config;


import cn.com.cig.cigrsbackend.security.JwtAuthenticationTokenFilter;
import cn.com.cig.cigrsbackend.security.WxAppletAuthenticationFilter;
import cn.com.cig.cigrsbackend.security.WxAppletAuthenticationManager;
import cn.com.cig.cigrsbackend.security.handler.CustomAccessDeniedHandler;
import cn.com.cig.cigrsbackend.security.handler.CustomAuthenticationEntryPoint;
import cn.com.cig.cigrsbackend.security.handler.CustomAuthenticationSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
* @Description: security配置类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/22
*/
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf()
                .disable()
                .sessionManagement()
                // 不创建Session, 使用jwt来管理用户的登录状态
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // /error 异常端点不需要用户认证
                .antMatchers("/error/**","/build/**","/cmaps/**","/images/**",
                        "/locale/**","/yxs/**","/*.pdf","/*.js","/*.css",
                        "/*.html","/*.js.map","/*.txt","/*.ico","/user/token","/ufd/*").permitAll()
                // 其余的全部需要用户认证
                .anyRequest().authenticated()
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
                .accessDeniedHandler(new CustomAccessDeniedHandler());
            // 使用WxAppletAuthenticationFilter替换默认的认证过滤器UsernamePasswordAuthenticationFilter
        http.addFilterAt(wxAppletAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                // 在WxAppletAuthenticationFilter前面添加用于验证jwt，识别用户是否登录的过滤器
                .addFilterBefore(jwtAuthenticationTokenFilter(), WxAppletAuthenticationFilter.class);
    }

    @Autowired
    private WxAppletAuthenticationManager wxAppletAuthenticationManager;

    @Bean
    public WxAppletAuthenticationFilter wxAppletAuthenticationFilter(){
        WxAppletAuthenticationFilter wxAppletAuthenticationFilter = new WxAppletAuthenticationFilter("/user/login");
        wxAppletAuthenticationFilter.setAuthenticationManager(wxAppletAuthenticationManager);
        wxAppletAuthenticationFilter.setAuthenticationSuccessHandler(customAuthenticationSuccessHandler());
        return wxAppletAuthenticationFilter;
    }

    @Bean
    public CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler(){
        return new CustomAuthenticationSuccessHandler();
    }

    @Bean
    public JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter() {
        return new JwtAuthenticationTokenFilter();
    }

}
