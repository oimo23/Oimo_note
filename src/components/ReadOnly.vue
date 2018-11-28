<template>
	<div class="readonly">
		<h1 class="logo">
			<span v-if="redirecting">
				<div class="loading"></div>
			</span>
			<span v-else><router-link to="/" target="_blank"><img src="~/../assets/logo.png" alt="OimoNote" width="300"></router-link></span>
		</h1>
		<div class="readonly_text">
			<div>
				<pre>{{this.notepads.txt}}</pre>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "editor",
	created: function () {
		// URLの最後の"/"以降を取得
		let urlParam = location.pathname.replace("/share/","");

		// 持っていないならトップへリダイレクト
		if (urlParam == "") {
			document.location = "/";	
		} else {
			// このnotepadのshareIDを定義
			this.notepads.shareid = urlParam;
		}

		firebase
			.firestore()
			.collection("shareid")
			.doc(this.notepads.shareid)
			.get()
			.then(doc => {
				if (doc.exists) {

					this.notepads.id = doc.data().id;
					
					firebase
					.firestore()
					.collection("notepads")
					.doc(this.notepads.id)
					.get()
					.then(doc => {
						if (doc.exists && doc.data().notepads.id == this.notepads.id) {					
							this.notepads = doc.data().notepads;
						}
					});
				} else {
					//　Paramに値を持っているが存在するIDではない
					document.location = "/";
				}
			});
	},
	data() {
		return {
			notepads: {
				id: null,
				txt: null,
				shareid: null,
				pass: false,
				alias: false
			},
			hasSaved: false,
			redirecting: false,
		};
	},
	methods: {

	}
};
</script>

<style scoped lang="scss">
.readonly {
	display: flex;
	justify-content: center;
	align-items: center;
}

.readonly_text {
	width: 800px;
	max-width: 100%;
	animation: editor_anim 2.5s forwards;
}

.readonly_text div {
	width: 800px;
	max-width: 100%;
	height : 750px;
	margin : 0 auto;
	background: #303841;
	color: #F5F5F5;
	padding : 10px;
	font-size : 13px;
	line-height: 1.8;
	border : none;
	text-align: left;
}

pre {
	padding: 0;
	background: #303841;
	color: #F5F5F5;
	border: none;
}

@media screen and (max-width:950px) { 
	.readonly {
		display: block;
	}

	.readonly_text {
		width: 98%;
		margin: 0 auto;
	}
	
	.readonly_text div {
		height : calc(100vh - 200px);
	}

	h1 {
		img {
			width: 150px;
		}
	}

}
</style>
