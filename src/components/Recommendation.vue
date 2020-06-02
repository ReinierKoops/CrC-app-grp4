<template>
  <div>
    <h3>Recommendations</h3>  
    <ul>
      <li :draggable="draggable" v-for="song in songs" :id="song" :key="song" v-on:dragstart="dragStart" v-on:dragenter="dragEnter" v-on:drop="dragDrop" v-on:dragover="dragOver">{{ song }}</li>
    </ul>    
  </div>
</template>

<script>
export default {
  props: ["songs", "draggable"],
  methods: {
    dragStart: function(ev) {
      var event = new CustomEvent("dragStarted", {"detail": {id: ev.target.id, source: "recommendation"}});
      document.dispatchEvent(event)
    },
    dragDrop: function(ev) {
      var event = new CustomEvent("dragDropped", {"detail": {id: ev.target.id, source: "recommendation"}});
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
