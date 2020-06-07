<template>
  <div>
    <h3>{{ name }}</h3>

    <v-btn v-if="draggable" v-on:click="clickReset">Reset</v-btn>
    
    <v-list>
      <v-list-item 
      :draggable="draggable" 
      v-for="song in songs" 
      :id="song.id" 
      :key="song.title" 
      v-on:dragstart="dragStart" 
      v-on:dragenter="dragEnter" 
      v-on:drop="dragDrop" 
      v-on:dragover="dragOver">

        <v-list-item-content>
          <v-list-item-title v-text="song.artist + ' - ' + song.title"/>
        </v-list-item-content>

      </v-list-item>
    </v-list>    
  </div>
</template>

<script>
export default {
  props: ["songs", "draggable", "name"],
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
