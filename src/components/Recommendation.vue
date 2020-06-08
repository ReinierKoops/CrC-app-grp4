<template>
  <v-card
  class="elevation-10"
  tile
  >
    <v-card-title class="subtitle-1">
      <b>{{ name }}</b>
    </v-card-title>
    <v-card-subtitle class="caption">
      {{ subname }}
    </v-card-subtitle>

    <v-divider></v-divider>

    <v-list
    dense
    >
      <v-list-item 
      class="add_border"
      :draggable="draggable" 
      v-for="song in songs" 
      :id="song.id" 
      :key="song.title" 
      v-on:dragstart="dragStart" 
      v-on:dragenter="dragEnter" 
      v-on:drop="dragDrop" 
      v-on:dragover="dragOver">

        <v-list-item-content two-line>
          <v-list-item-title>{{ song.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ song.artist }}</v-list-item-subtitle>
          <v-divider></v-divider>
        </v-list-item-content>

      </v-list-item>
    </v-list>

    <v-card-actions v-if="draggable">
      <v-btn 
            tile 
            :block="true"
            color="#2296F3"
            class="white--text"
            v-on:click="clickReset"
            >
                <v-icon>mdi-undo</v-icon>Reset
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
export default {
  props: ["songs", "draggable", "name", "subname"],
  methods: {
    dragStart: function(ev) {
      let closest = ev.target.closest("div.v-list-item");
      let event = new CustomEvent("dragStarted", {"detail": {id: closest.id, source: "recommendation"}});
      document.dispatchEvent(event);
    },
    dragDrop: function(ev) {
      let closest = ev.target.closest("div.v-list-item");
      let event = new CustomEvent("dragDropped", {"detail": {id: closest.id, source: "recommendation"}});
      document.dispatchEvent(event);
    },
    dragOver: function(ev) {
      ev.preventDefault();      
    },
    dragEnter: function(ev) {
      ev.preventDefault();
    },
    clickReset: function() {
      document.dispatchEvent(new CustomEvent('resetList'));
    }
  }
};
</script>
