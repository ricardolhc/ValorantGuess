package com.valorant.guess.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.valorant.guess.entity.Ability;
import com.valorant.guess.service.ServiceAbilities;

@Controller
public class ControllerAbilities {

    @Autowired
    private ServiceAbilities serviceAbilities;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/abilities")
    public ResponseEntity<List<Ability>> abilities() {
        return serviceAbilities.getAllAbilities();
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/abilities/{id}")
    public ResponseEntity<List<Ability>> abilitiesByAgentId(@PathVariable String id) {
        return serviceAbilities.getAgentAbilities(id);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/abilities/random")
    public ResponseEntity<Ability> abilityRandom() {
        return serviceAbilities.getRandomAbility();
    }
    
}
