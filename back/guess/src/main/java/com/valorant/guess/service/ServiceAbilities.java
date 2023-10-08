package com.valorant.guess.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.valorant.guess.entity.ListAgent;

import com.valorant.guess.entity.Ability;
import com.valorant.guess.entity.Agent;
import com.valorant.guess.entity.Data;

@Service
public class ServiceAbilities {

    public final String API = "https://valorant-api.com/v1/agents/";
	public final String CODIGO_SUCESSO = "200";

    public ResponseEntity<List<Ability>> getAllAbilities() {

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

                List<Ability> abilities = new ArrayList<Ability>();

                for (Data data : agents.getData()) {
                    for (Ability ability : data.getAbilities()) {
                        abilities.add(ability);
                    }
                }

                return ResponseEntity.ok(abilities);
			}

		} catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<List<Ability>> getAgentAbilities(String id) {
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

                List<Ability> abilities = agent.getData().getAbilities();

                return ResponseEntity.ok(abilities);
			}

		} catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<Ability> getRandomAbility() {
		ResponseEntity<List<Ability>> responseEntity = getAllAbilities();
		List<Ability> abilities = responseEntity.getBody();

        String icon = null;
        Ability ability = null;

        do {
            int random = (int) (Math.random() * abilities.size());
            ability = abilities.get(random);
            icon = ability.getDisplayIcon();

        } while (icon == null || icon.isEmpty());

		return ResponseEntity.ok(ability);
	}
    
}
