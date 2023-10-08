package com.valorant.guess.entity;

public class Ability {

    private String slot;
    private String displayName;
    private String displayIcon;

    public String getSlot() {
        return slot;
    }

    public void setSlot(String slot) {
        this.slot = slot;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayname) {
        this.displayName = displayname;
    }

    public String getDisplayIcon() {
        return displayIcon;
    }

    public void setDisplayIcon(String displayicon) {
        this.displayIcon = displayicon;
    }

    @Override
    public String toString() {
        return "Ability [slot=" + slot + ", displayName=" + displayName + ", displayIcon=" + displayIcon + "]";
    }
    
}
