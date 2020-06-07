<template>
  <v-card
  class="elevation-10"
  tile
  >
    <v-card-title>
      {{ name }}
    </v-card-title>
    <v-card-subtitle>
      {{ subname }}
    </v-card-subtitle>

    <v-divider></v-divider>

    <v-list
    dense
    >
      <v-list-item 
      :draggable="draggable" 
      v-for="(song, index) in songs" 
      :id="song.id" 
      :key="name + song.title" 
      v-on:dragstart="dragStart" 
      v-on:dragenter="dragEnter" 
      v-on:drop="dragDrop" 
      v-on:dragover="dragOver">

        <v-list-item-icon>
          <v-icon>mdi-numeric-{{index + 1}}</v-icon>
        </v-list-item-icon>
        
        <v-list-item-content two-line>
          <v-list-item-title>{{ song.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ song.artist }}</v-list-item-subtitle>
          <v-divider></v-divider>
        </v-list-item-content>
          
      </v-list-item>
    </v-list>   
  </v-card>
</template>

<script>
export default {
  props: ["songs", "name", "subname", "draggable"],
  methods: {
    dragStart: function(ev) {
      let closest = ev.target.closest("div.v-list-item");
      let event = new CustomEvent("dragStarted", {"detail": {id: closest.id, source: "preferences"}});
      document.dispatchEvent(event)
    },
    dragDrop: function(ev) {
      let closest = ev.target.closest("div.v-list-item");
      let event = new CustomEvent("dragDropped", {"detail": {id: closest.id, source: "preferences"}});
      document.dispatchEvent(event)
    },
    dragOver: function(ev) {
      ev.preventDefault();      
    },
    dragEnter: function(ev) {
      ev.preventDefault();
    }
  }
};
</script>
