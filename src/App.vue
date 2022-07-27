<template>
  <div
    class="view login d-flex justify-content-center align-items-center"
    v-if="state.username === '' || state.username === null"
  >
    <form class="login-form p-4" @submit.prevent="Login">
      <div class="form-inner">
        <h1 class="mt-4">Login to Firechat</h1>
        <label for="username">Username</label>
        <input
          v-model="inputUsername"
          type="text"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Please enter your username..."
        />
        <div class="d-flex justify-content-center mt-4">
          <input type="submit" value="Login" class="btn btn-primary" />
        </div>
      </div>
    </form>
  </div>

  <div class="view chat" v-else>
    <header class="px-3">
      <div class="d-flex justify-content-end">
        <button @click="Logout" class="logout btn text-white px-3 py-2">
          Logout
        </button>
      </div>
      <h1 class="text-white">Welcome, {{ state.username }}</h1>
    </header>
    <section class="chat-box p-3 mt-4">
      <div class="chat-inner">
        <div
          v-for="message in state.messages"
          :key="message.key"
          :class="
            message.username == state.username
              ? 'message current-user'
              : 'message'
          "
        >
          <div class="message-inner">
            <div class="username">{{ message.username }}</div>
            <div class="content">{{ message.content }}</div>
          </div>
        </div>
      </div>
    </section>

    <footer class="keyboard-box p-3">
      <form @submit.prevent="SendMessage" class="d-flex">
        <input
          type="text"
          v-model="inputMessage"
          placeholder="Write a message..."
        />
        <input type="submit" value="send" class="btn btn-primary" />
      </form>
    </footer>
  </div>
</template>
<script>
// import { RouterLink, RouterView } from "vue-router";
import { reactive, onMounted, ref } from "vue";
import db from "./database";

export default {
  setup() {
    const inputUsername = ref("");
    const inputMessage = ref("");

    const state = reactive({
      username: "",
      messages: [],
    });

    const Login = () => {
      if (inputUsername.value != "" || inputUsername.value != null) {
        state.username = inputUsername.value;
        inputUsername.value = "";
      }
    };

    const SendMessage = () => {
      const messagesRef = db.database().ref("messages");
      if (inputMessage.value === "" || inputMessage.value === null) {
        return;
      }

      const message = {
        username: state.username,
        content: inputMessage.value,
      };

      messagesRef.push(message);
      inputMessage.value = "";
    };

    const Logout = () => {
      state.username = "";
    };

    onMounted(() => {
      const messageRef = db.database().ref("messages");

      messageRef.on("value", (snapshot) => {
        const data = snapshot.val();
        let messages = [];
        Object.keys(data).forEach((key) => {
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content,
          });
        });
        state.messages = messages;
      });
    });
    return {
      state,
      inputUsername,
      inputMessage,
      Login,
      Logout,
      SendMessage,
    };
  },
};
</script>

<style lang="scss">
.view {
  background: var(--primary) !important;
  height: 100vh;
  &.login {
    .login-form {
      display: block;
      width: min(90vw, 500px);
      background-color: var(--offwhite);
      padding: 50px 15px;
      border-radius: 16px;
      box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
      h1 {
        font-size: 28px;
      }
      label {
        color: #aaa;
      }
      input[type="text"] {
        padding: 10px 15px;
        border-radius: 8px;
        box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
        &::placeholder {
          color: #888;
          transition: 0.4s;
        }
      }
      input[type="submit"] {
        width: 100px;
        padding: 10px 15px;
        border-radius: 8px;
        font-weight: 700;
      }
      &:focus-within {
        input[type="text"] {
          background-color: #fff;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
          &::placeholder {
            color: #666;
          }
        }
      }
    }
  }

  &.chat {
    flex-direction: column;
    position: relative;
    max-height: 100vh;
    header {
      position: sticky;
      top: 0;
      display: block;
      width: 100%;
      padding: 50px 30px 10px;
      height: 100px;
      .logout {
        position: absolute;
        top: 15px;
        right: 15px;
        appearance: none;
        border: none;
        outline: none;
        background: none;

        color: #fff;
        font-size: 18px;
        margin-bottom: 10px;
        text-align: right;
      }
      h1 {
        color: #fff;
      }
    }

    .chat-inner {
      height: fit-content;
      padding-bottom: 78px;
    }
    .chat-box {
      background-color: var(--offwhite);
      border-top-right-radius: 16px;
      border-top-left-radius: 16px;
      overflow-y: scroll;
      height: calc(100vh - 100px);
      flex: 1 1 100%;
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      .message {
        display: flex;
        margin-bottom: 15px;
        &-inner {
          .username {
            color: #888;
            /* font-size: 16px; */
            margin-bottom: 5px;
            padding: 0 15px;
          }
          .content {
            padding: 10px 20px;
            background-color: #f3f3f3;
            border-radius: 999px;
            color: #333;
            font-size: 18px;
            line-height: 1.2em;
            text-align: left;
          }
        }
        &.current-user {
          margin-top: 30px;
          justify-content: flex-end;
          text-align: right;
          .message-inner {
            max-width: 75%;
            .content {
              color: #fff;
              font-weight: 600;
              background-color: var(--primary);
            }
          }
        }
      }
    }
  }
  & .keyboard-box {
    background-color: var(--offwhite);
    height: fit-content;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
    position: fixed;
    bottom: 0px;
    width: 100%;

    & input[type="text"] {
      appearance: none;
      border: none;
      outline: none;
      background: none;
      color: #333;
      background-color: #f3f3f3;
      padding: 10px 15px;
      width: 100%;
    }
    & input[type="submit"] {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      padding: 10px 15px;
    }
  }
}
</style>
