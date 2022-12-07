<template>
  <h1>{{ msg }}</h1>
  <Hello />
</template>

<script>
// import Hello from "./components/Hello.vue";
// import Hello from "./components/Hello";
import Hello from "~/components/Hello";

export default {
  components: {
    Hello,
  },
  data() {
    return {
      msg: "app component!",
    };
  },
};
</script>
