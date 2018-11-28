import Vue from "vue";
import VueRouter from "vue-router";
import Main from "./views/Main";
import Share from "./views/Share"

Vue.use(VueRouter);
const routes = [
	{
		path: "/share",
		component: Share
	},
	{
		path: "/share/:id",
		component: Share,
		name: "share"
	},
	{
		path: "*",
		component: Main
	}
];

export default new VueRouter({
	routes: routes,
	mode: 'history'
});