<template>
	<div class="sidemenu">
		<p class="burger_menu"><span uk-toggle="target: #offcanvas-nav-primary" uk-icon="icon:menu; ratio: 2"></span></p>
		<div id="offcanvas-nav-primary" uk-offcanvas="overlay: true">
			<div class="uk-offcanvas-bar uk-flex uk-flex-column">

				<ul class="uk-nav uk-nav-primary uk-nav-center uk-margin-auto-vertical">
					<li class="uk-nav-header">Menu</li>
					<li><router-link to="./" target="_blank"><span class="uk-margin-small-right" uk-icon="icon: pencil"></span> New</router-link></li>
					<li><router-link :to="{name:'share',params:{id:this.shareid}}"  target="_blank"><span class="uk-margin-small-right" uk-icon="icon: users"></span> Share</router-link></li>
					<li><a href="#modal-center" uk-toggle><span class="uk-margin-small-right" uk-icon="icon: lock"></span> Lock</a></li>
				</ul>

			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "SideMenu",
	props: {
		notepads: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			shareid: this.notepads.shareid
		}
	}
}
</script>

<style scoped lang="scss">
.uk-offcanvas-bar {
	background: #2B323A;
}

.burger_menu {
	position: fixed;
	top: 10px;
	left : 10px;
	font-size: 20px;
	font-weight: bold;
	cursor: pointer;
	z-index: 9999;
}
</style>
