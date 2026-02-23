package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.escuelita.www.entity.Areas;

@Repository
public interface AreasRepository extends JpaRepository<Areas, Long> {

}