<template>
  <b-container fluid>
    <b-row class="text-center">
      <b-col md="6" class="py-3">
        <div class="text-center my-3">
          <b-form @submit="createPost" @reset="onReset">
            <b-form-group label="Name:">
              <b-form-input type="text" v-model="postData.name" required placeholder="Name"></b-form-input>
            </b-form-group>

            <b-form-textarea
              v-model="postData.description"
              placeholder="Enter something"
              :rows="3"
              :max-rows="6"
            ></b-form-textarea>

            <b-button type="submit" variant="primary">Submit</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
          </b-form>
        </div>
      </b-col>
      <b-col md="6" class="py-3">
        <b-table :items="todos"></b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import * as subscriptions from "../graphql/subscriptions.js";
import * as mutations from "../graphql/mutations.js";
import * as queries from "../graphql/queries.js";

export default {
  name: "Database",
  data: () => {
    return {
      postData: {
        name: "",
        description: "",
        done: false
      },
      myPost: "",
      errors: [],
      todos: []
    };
  },
  mounted: function() {
    API.graphql(graphqlOperation(queries.listTodos))
      .then(result => {
        if (
          result &&
          result.data &&
          result.data.listTodos &&
          result.data.listTodos.items
        ) {
          this.todos = result.data.listTodos.items;
        }
      })
      .catch(error => {
        console.error(error);
      });

    API.graphql(graphqlOperation(subscriptions.onCreateTodo)).subscribe({
      next: data => {
        const result = data.value.data.onCreateTodo;
        console.info(result);

        this.todos.push({
          id: result.id,
          name: result.name,
          description: result.description,
          done: result.done
        });
      },
      error: error => {
        console.error(error);
      }
    });
  },
  methods: {
    createPost: function(event) {
      event.preventDefault();

      API.graphql(
        graphqlOperation(mutations.createTodo, { input: this.$data.postData })
      )
        .then(response => {
          console.log(response);
          this.myPost = response;
        })
        .catch(error => {
          console.error(error);
          this.errors = error.errors;
        });
    },
    onReset: () => {}
  }
};
</script>