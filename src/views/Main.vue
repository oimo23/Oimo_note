<template>
  <div v-cloak>
		<!-- ローディング中のとき表示 -->
		<Loading v-if="loading"/>

		<!-- パスワードが掛かっているとき表示 -->
		<Locked v-else-if="locked" :msg="this.errorMsg" @changePasswordInput="changePasswordInput" @checkPass="checkPass"/>
		
		<!-- それ以外 -->
		<div v-else>
			<SideMenu :notepads="this.notepads"/>

      <PassModal :msg="this.errorMsg" @changePasswordInput="changePasswordInput" @lockNotepad="lockNotepad"/>

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
import SideMenu from "../components/SideMenu.vue";
import Loading from "../components/Loading.vue";
import Locked from "../components/Locked.vue";
import PassModal from "../components/PassModal.vue";

export default {
	name: "app",
	components: {
		SideMenu,
		Loading,
    Locked,
    PassModal
	},
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
			errorMsg: null,
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
		// パスワードを設定
		// **********************************************
		changePasswordInput: function(value) {
			this.$set(this.notepads, "pass", value);
		},
		// **********************************************
		// パスワードを掛ける
		// **********************************************
		lockNotepad: function() {
      if(this.notepads.pass === null || this.notepads.pass === "") {
        this.errorMsg = "Password is empty";
        return;
      }

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
          this.errorMsg = null;
					this.locked = false;
					this.notepads = doc.data().notepads;
				} else {
					this.errorMsg = "Wrong Password";
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
