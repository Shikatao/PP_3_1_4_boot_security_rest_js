package ru.kata.spring.boot_security.demo.dao;


import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Repository
public class UserDaoImp implements UserDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<User> getAllUsers() {
        return entityManager.createQuery("select u from User u", User.class)
                .getResultList();
    }

    @Override
    public void saveUser(User user) {
        entityManager.persist(user);
    }


    @Override
    public User getUser(Long id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public void deleteUser(Long id) {
        entityManager.remove(getUser(id));
    }

    @Override
    public void updateUser(User user) {
        entityManager.merge(user);
    }

    @Override
    public User findByEmail(String email) {
        TypedQuery<User> typedQuery = entityManager.createQuery(
                "select u from User u where u.email = :email", User.class);
        typedQuery.setParameter("email", email);
        return typedQuery.getSingleResult();
    }
}
