package com.valorant.guess.entity;

import java.util.List;

public class ListAgent {

    private String status;
    private List<Data> data;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Data> getData() {
        return data;
    }

    public void setData(List<Data> data) {
        this.data = data;
    }

    public Agent getRandomAgent() {
        int random = (int) (Math.random() * data.size());
        Data data = this.data.get(random);
        Agent agent = new Agent();
        agent.setStatus(this.status);
        agent.setData(data);
        return agent;
    }
    
}
