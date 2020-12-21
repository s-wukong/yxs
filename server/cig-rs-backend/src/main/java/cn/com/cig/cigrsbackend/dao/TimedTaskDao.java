package cn.com.cig.cigrsbackend.dao;


import org.apache.ibatis.annotations.Delete;
import org.springframework.stereotype.Repository;


@Repository
public interface TimedTaskDao {
    @Delete("DELETE  FROM  translation_entity  where NOW() > date_add(translation_entity.update ,interval 3 day)")
    int deleteByDate();
}
