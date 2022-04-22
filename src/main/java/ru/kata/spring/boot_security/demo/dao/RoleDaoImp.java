package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.Role;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Repository
public class RoleDaoImp implements RoleDao {

    @PersistenceContext
    private EntityManager entityManager;

    public Role findByRole(String role) {
        role = "ROLE_" + role;
        TypedQuery<Role> typedQuery = entityManager.createQuery(
                "select r from Role r where r.name = :name", Role.class);
        typedQuery.setParameter("name", role);
        return typedQuery.getSingleResult();
    }

    @Override
    public List<Role> getAllRoles() {
        return entityManager.createQuery("select r from Role r", Role.class)
                .getResultList();

    }


}
