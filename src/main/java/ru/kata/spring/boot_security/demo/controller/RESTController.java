package ru.kata.spring.boot_security.demo.controller;


import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.model.Views;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class RESTController {

    @Autowired
    private UserService userService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @JsonView(Views.Public.class)
    @GetMapping("/users")
    public List<User> showAllUsers() {
        List<User> allUsers = userService.getAllUsers();
        return allUsers;
    }


    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @JsonView(Views.Public.class)
    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Long id) {
        User user = userService.getUser(id);
        return user;
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @JsonView(Views.Public.class)
    @PostMapping("/users")
    public User addNewUser(@RequestBody User user) {
        userService.saveUser(user);
        return user;
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @JsonView(Views.Public.class)
    @PutMapping("/users")
    public List<User> UpdateUser(@RequestBody User user) {
        userService.updateUser(user);
        List<User> allUsers = userService.getAllUsers();
        return allUsers;
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @JsonView(Views.Public.class)
    @DeleteMapping("/users/{id}")
    public List<User> deleteUser(@PathVariable Long id) throws Exception {
        User user = userService.getUser(id);
        if (user == null) {
            throw new Exception("There is no user with ID = " + id + " in Database");
        }
        userService.deleteUser(id);
        List<User> allUsers = userService.getAllUsers();

        return allUsers;
    }


    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @JsonView(Views.Public.class)
    @GetMapping("/roles")
    public List<Role> showAllRoles() {
        List<Role> allRoles = userService.getAllRoles();
        return allRoles;
    }

    @PreAuthorize("isAuthenticated()")
    @JsonView(Views.Public.class)
    @GetMapping("/user_bar")
    public User showUserBar(Principal principal) {
        User userBar = userService.findByEmail(principal.getName());
        return userBar;
    }

}
