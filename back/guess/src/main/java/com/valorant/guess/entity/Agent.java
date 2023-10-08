package com.valorant.guess.entity;

public class Agent {

	private String status;
	private Data data;

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
	public Data getData() {
		return data;
	}

	public void setData(Data data) {
		this.data = data;
	}

	public void setUuid(Data data) {
		this.data = data;
	}



	@Override
	public String toString() {
		return "Endereco [Data=" + data.toString() + "]";
	}
	
}