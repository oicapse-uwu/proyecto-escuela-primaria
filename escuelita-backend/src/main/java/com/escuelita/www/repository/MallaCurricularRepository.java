package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.escuelita.www.entity.MallaCurricular;

@Repository
public interface MallaCurricularRepository extends JpaRepository<MallaCurricular, Long> {

}