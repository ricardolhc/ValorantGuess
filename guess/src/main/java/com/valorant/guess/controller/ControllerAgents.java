package com.valorant.guess.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.valorant.guess.entity.Agent;
import com.valorant.guess.entity.ListAgent;
import com.valorant.guess.service.ServiceAgents;

@Controller
public class ControllerAgents {

    @Autowired
    private ServiceAgents serviceAgents;

    @GetMapping("/agents")
    public ResponseEntity<ListAgent> agents() {
        return serviceAgents.getAllAgents();
    }

    @GetMapping("/agents/{id}")
    public ResponseEntity<Agent> agents(@PathVariable String id) {
        return serviceAgents.getAgent(id);
    }
    
}
