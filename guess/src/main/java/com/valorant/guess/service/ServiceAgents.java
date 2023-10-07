package com.valorant.guess.service;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.valorant.guess.entity.Agent;
import com.valorant.guess.entity.ListAgent;

@Service
public class ServiceAgents {

    public final String API = "https://valorant-api.com/v1/agents/";
	public final String CODIGO_SUCESSO = "200";

    public ResponseEntity<ListAgent> getAllAgents() {

		HttpGet request = new HttpGet(API);

		try (CloseableHttpClient httpClient = HttpClientBuilder.create().disableRedirectHandling().build();
				CloseableHttpResponse response = httpClient.execute(request)) {

			HttpEntity entity = response.getEntity();
			if (entity != null) {
				String result = EntityUtils.toString(entity);

				Gson gson = new Gson();
                ListAgent agents = gson.fromJson(result, ListAgent.class);

				if (!agents.getStatus().equals(CODIGO_SUCESSO)) {
					return ResponseEntity.badRequest().build();
				}

                return ResponseEntity.ok(agents);
			}

		} catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<Agent> getAgent(String id) {
		HttpGet request = new HttpGet(API + id);

		try (CloseableHttpClient httpClient = HttpClientBuilder.create().disableRedirectHandling().build();
				CloseableHttpResponse response = httpClient.execute(request)) {

			HttpEntity entity = response.getEntity();
			if (entity != null) {
				String result = EntityUtils.toString(entity);

				Gson gson = new Gson();
                Agent agent = gson.fromJson(result, Agent.class);

				if (!agent.getStatus().equals(CODIGO_SUCESSO)) {
					return ResponseEntity.badRequest().build();
				}

                return ResponseEntity.ok(agent);
			}

		} catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.badRequest().build();
    }
    
}
