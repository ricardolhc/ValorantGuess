package com.valorant.guess.entity;

import java.util.List;

public class Data {

    private String uuid;
    private String displayName;
    private String displayIcon;

    private List<Ability> abilities;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayname(String displayname) {
        this.displayName = displayname;
    }

    public String getDisplayIcon() {
        return displayIcon;
    }

    public void setDisplayicon(String displayicon) {
        this.displayIcon = displayicon;
    }

    public List<Ability> getAbilities() {
        return abilities;
    }

    public void setAbilities(List<Ability> ability) {
        this.abilities = ability;
    }

    @Override
    public String toString() {
        return "Data [abilities=" + abilities.toString() + ", displayIcon=" + displayIcon + ", displayName=" + displayName
                + ", uuid=" + uuid + "]";
    }
    
}
