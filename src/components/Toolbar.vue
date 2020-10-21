<template>
    <md-toolbar class="md-primary">
      <md-button v-if="user" class="md-icon-button" @click="toggleMenu">
        <md-icon>menu</md-icon>
      </md-button>
      <span @click="goToDashboard" id="minhaLogo" class="md-title">Di Santi Store</span>

      <div class="md-toolbar-section-end">
        <md-button v-show="user" class="md-primary" @click="logout">Sair</md-button>
      </div>
    </md-toolbar>
</template>

<script>
export default {
    name: 'Toolbar',
    props: {
        user: {
            type: Object,
            default: null,
        }
    },
    methods: {
        toggleMenu() {
            this.$emit('onMenuClick', true)
        },
        goToDashboard() {
            this.$emit('onDrawerLogoClick')
        },
        logout() {
            this.$emit('onLogoutClick')
        }
    }
}
</script>

<style scoped>
    .md-title {
        cursor: pointer;
    }
</style>