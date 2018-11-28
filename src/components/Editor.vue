<template>
	<div v-cloak>
		<!-- ローディング中のとき表示 -->
		<div v-if="loading">
			<span>
				<div class="loading"></div>
			</span>
		</div>

		<!-- パスワードが掛かっているとき表示 -->
		<div v-else-if="locked" class="pass">
			<p><img src="~/../assets/logo.png" alt="OimoNote" width="200"></p>
			<input type="password" class="uk-input" v-model="notepads.pass" placeholder="Input Password">
			<button class="pass_btn uk-button uk-button-primary" @click="checkPass">OK</button>
			<div v-if="msg1" class="alert">
				<p>{{ msg1 }}</p>
			</div>
		</div>
		
		<!-- それ以外 -->
		<div v-else>
			<div class="sidemenu">
				<p class="burger_menu"><span uk-toggle="target: #offcanvas-nav-primary" uk-icon="icon:menu; ratio: 2"></span></p>
				<div id="offcanvas-nav-primary" uk-offcanvas="overlay: true">
					<div class="uk-offcanvas-bar uk-flex uk-flex-column">

						<ul class="uk-nav uk-nav-primary uk-nav-center uk-margin-auto-vertical">
							<li class="uk-nav-header">Menu</li>
							<li><router-link to="./" target="_blank"><span class="uk-margin-small-right" uk-icon="icon: pencil"></span> New</router-link></li>
							<li><router-link :to="{name:'share',params:{id:this.notepads.shareid}}"  target="_blank"><span class="uk-margin-small-right" uk-icon="icon: users"></span> Share</router-link></li>
							<li><a href="#modal-center" uk-toggle><span class="uk-margin-small-right" uk-icon="icon: lock"></span> Lock</a></li>
						</ul>

					</div>
				</div>
			</div>
			<div id="modal-center" class="uk-flex-top" uk-modal>
				<div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">

					<button class="uk-modal-close-default" type="button" uk-close></button>

					<p><input type="password" class="uk-input" value="" v-model="notepads.pass" placeholder="Input Password"></p>
					<button class="uk-button uk-button-primary" @click="lockNotepad">OK</button>

				</div>
			</div>
			<div class="editor">
				<h1 class="logo">
					<span><img src="~/../assets/logo.png" alt="OimoNote" width="300"></span>
				</h1>
				<div class="editor_text">
					<textarea class="editor_textarea" id="editor_textarea" v-model="notepads.txt" placeholder="Simple Online notepad editor!" @keydown="changeWatch">
						
					</textarea>
					<div class="align_right">
						<p :class="{ active: hasSaved }" class="saved">Saved</p>
						<p :class="{ active: hasLocked }" class="locked">Locked</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "editor",
	created: function () {
		// URLの最後の"/"以降を取得
		let urlParam = location.pathname.replace("/","");

		// 持っていないならIDを発行し,DBに登録した上でリダイレクト
		if (urlParam == "") {
			this.notepads.id = getUnique();
			this.notepads.shareid = getUnique();
			
			firebase
			.firestore()
			.collection("notepads")
			.doc(this.notepads.id)
			.set({ notepads: this.notepads })

			firebase
			.firestore()
			.collection("shareid")
			.doc(this.notepads.shareid)
			.set({ id: this.notepads.id })
			.then( () => {
				document.location = "/" + this.notepads.id;
			});

			return false;
		} else {
			// このnotepadのIDを定義
			this.notepads.id = urlParam;
		}

		// IDがDBに既に存在していてパスワードが掛かっていないならデータを引き出して表示
		firebase
			.firestore()
			.collection("notepads")
			.doc(this.notepads.id)
			.get()
			.then(doc => {
				// 鍵が掛かっている場合
				if (doc.exists && doc.data().notepads.pass != null) {	
					this.locked = true;
					this.loading = false;
				
				// 鍵が掛かっていない場合
				} else if (doc.exists && doc.data().notepads.id == this.notepads.id) {		
					this.notepads = doc.data().notepads;
					this.loading = false;

				//　存在するIDではない場合
				} else {
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
				pass: null,
				alias: false
			},
			hasSaved: false,
			hasLocked: false,
			loading: true,
			locked: false,
			msg1: null,
		};
	},
	methods: {
		// **********************************************
		// ノート情報を保存
		// **********************************************
		saveNotepad: function() {
			firebase
			.firestore()
			.collection("notepads")
			.doc(this.notepads.id)
			.set({ notepads: this.notepads });

			// 3秒間"saved"メッセージを表示する
			this.hasSaved = true;
			setTimeout(() => { 
				this.hasSaved = false;
			}, 2000);
		},

		// **********************************************
		// パスワードを掛ける
		// **********************************************
		lockNotepad: function() {
			firebase
			.firestore()
			.collection("notepads")
			.doc(this.notepads.id)
			.set({ notepads : this.notepads });

			// 開いているモーダルを閉じる
			UIkit.modal("#modal-center").hide();

			// 3秒間"Locked"メッセージを表示する
			this.hasLocked = true;
			setTimeout(() => { 
				this.hasLocked = false;
			}, 3000);
		},

		// **********************************************
		// textareaに入力があった時、3秒後に保存を実行するタイマーを設置
		// **********************************************
		changeWatch: function() {
			clearTimeout(saveTimer);
			saveTimer = setTimeout(this.saveNotepad , 3000);
		},

		// **********************************************
		// パスワード照合
		// **********************************************
		checkPass: function() {
			firebase
			.firestore()
			.collection("notepads")
			.doc(this.notepads.id)
			.get()
			.then(doc => {
				if (doc.exists && doc.data().notepads.pass == this.notepads.pass) {	
					this.locked = false;
					this.notepads = doc.data().notepads;
				} else {
					this.msg1 = "Wrong Password";
				}
			});
		}
	}
};

let saveTimer;

function getUnique(myStrong){
	let strong = 1000;
	if (myStrong) strong = myStrong;
	return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
}
</script>

<style scoped lang="scss">
[v-cloak] {
	display: none;
}

h1 {
	margin: 0;
}

.logo {
	position: relative;
	animation: logo_anim 2s forwards;
}

textarea {
	width: 100%;
	height : 750px;
	margin : 0 auto;
	background: #303841;
	color: #F5F5F5;
	padding : 10px;
	font-size : 13px;
	line-height: 1.8;
	border : none;
}

textarea:focus {
	outline: none;
	box-shadow: 0 0 13px #303841;
}

.editor {
	display: flex;
	justify-content: center;
	align-items: center;
}

.editor_text {
	width: 800px;
	max-width: 100%;
	animation: editor_anim 2.5s forwards;
}

.saved {
	opacity: 0;
	position: relative;
	display: inline-block;
	top: -85px;
	right: -106px;
	background : #37EAA0;
	box-shadow: 0 0 13px #37EAA0;
	color: #F5F5F5;
	padding: 10px 30px;
	transition: 1s;
}

.locked {
	opacity: 0;
	position: relative;
	display: inline-block;
	top: -85px;
	right: 10px;
	background : rgb(234, 91, 55);
	box-shadow: 0 0 13px rgb(234, 91, 55);
	color: #F5F5F5;
	padding: 10px 30px;
	transition: 1s;
}

.alert p {
	padding : 10px 20px;
	margin-top : 20px;
	transition: .3s;
	color: rgb(234, 91, 55);
	background: rgb(255, 233, 227);
}

.active {
	display: inline-block;
	animation: show 2s linear 0s;
}

.pass {
	width: 300px;
	margin : 0 auto;
	max-width: 100%;
}

::-webkit-scrollbar{
　　width: 10px;
}
::-webkit-scrollbar-track{
　　background: #fff;
　　border-left: solid 1px #ececec;
}
::-webkit-scrollbar-thumb{
　　background: #ccc;
　　border-radius: 10px;
　　box-shadow: inset 0 0 0 2px #fff;
}

.loading,
.loading::before,
.loading::after {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid #303841;
  border-left-color: #30384170;
  -webkit-border-radius: 999px;
  -moz-border-radius: 999px;
  border-radius: 999px;
}

.loading {
  margin: -25px 0 0 -25px;
  height: 50px;
  width: 50px;
  -webkit-animation: animation-rotate 1000ms linear infinite;
  -moz-animation: animation-rotate 1000ms linear infinite;
  -o-animation: animation-rotate 1000ms linear infinite;
  animation: animation-rotate 1000ms linear infinite;
}

.loading::before {
  content: "";
  margin: -23px 0 0 -23px;
  height: 44px;
  width: 44px;
  -webkit-animation: animation-rotate 1000ms linear infinite;
  -moz-animation: animation-rotate 1000ms linear infinite;
  -o-animation: animation-rotate 1000ms linear infinite;
  animation: animation-rotate 1000ms linear infinite;
}

.loading::after {
  content: "";
  margin: -29px 0 0 -29px;
  height: 56px;
  width: 56px;
  -webkit-animation: animation-rotate 2000ms linear infinite;
  -moz-animation: animation-rotate 2000ms linear infinite;
  -o-animation: animation-rotate 2000ms linear infinite;
  animation: animation-rotate 2000ms linear infinite;
}

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

input[type=password] {
	background: #313942;
	color: #F5F5F5;
}

input[type=password]:focus {
	outline: none;
	border: none;
	box-shadow: 0 0 13px #303841;
}

.pass {
	margin-top: -100px;

	& > p {
		margin: 0;
	}
}

.pass_btn {
	margin-top: 10px;
	margin-bottom: -10px;
}

.uk-modal-body {
	padding : 60px 20px 40px 20px;
	text-align: center;
}

@-webkit-keyframes animation-rotate {
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@-moz-keyframes animation-rotate {
  100% {
    -moz-transform: rotate(360deg);
  }
}

@-o-keyframes animation-rotate {
  100% {
    -o-transform: rotate(360deg);
  }
}

@keyframes animation-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes show{
    from{
        opacity: 0;
    }
	5% {
		opacity: 1;
	}
	65% {
		opacity: 1;
	}
    to {
        opacity: 0;
    }
}

@keyframes logo_anim{
    from{
		opacity: 0;
		right: -400px;
    }
	70% {
        opacity: 1;
		right: -400px;
	}
    to {
		top:0;
		right:0;
    }
}

@keyframes editor_anim{
    from{
        opacity: 0;
    }
	80% {
		opacity: 0;
	}
    to {
        opacity: 1;
    }
}


@media screen and (max-width:950px) { 
	.editor {
		display: block;
	}

	.editor_text {
		width: 98%;
		margin: 0 auto;
	}
	
	textarea {
		height : calc(100vh - 200px);
	}

	.saved,
	.locked {
		position: fixed;
		bottom: 0;
		right: 20px;
		top: initial;
	}

	textarea {
		font-size: 16px;
	}

	h1 {
		img {
			width: 150px;
		}
	}

	@keyframes logo_anim{
		from{
			opacity: 0;
			margin-top: 50%;
		}
		70% {
			opacity: 1;
			margin-top: 50%;
		}
		to {
			top:0;
			margin-top: 0%;
		}
	}

	@keyframes editor_anim{
		from{
			opacity: 0;
		}
		80% {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
}
</style>
