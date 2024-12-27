<template>
  <div>
    <button @click="$emit('add-random-user')">Testing</button>
  </div>
</template>

<script>
export default {
  name: "TestingButton", // Cambiamos el nombre del componente
};
</script>

<style>
button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
