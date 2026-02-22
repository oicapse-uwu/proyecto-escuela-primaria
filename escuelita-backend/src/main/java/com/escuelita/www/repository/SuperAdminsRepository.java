package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.escuelita.www.entity.SuperAdmins;

public interface SuperAdminsRepository extends JpaRepository<SuperAdmins, Long> {
}
